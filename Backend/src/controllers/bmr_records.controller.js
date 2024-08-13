const BMRRecord = require("../models/bmr_records.model");
const User = require("../models/user.model");
const BMR = require('../models/bmr.model');
const BMR_Tab = require("../models/bmr_tabs.model");
const BMR_section = require("../models/bmr_sections.model");
const BMR_field = require("../models/bmr_fields.model");
const { sequelize } = require("../config/db");

const getAllFieldsForBMR = async (bmr_id) => {
  const bmrForm = await BMR.findOne({
    where: {
      bmr_id,
      isActive: true,
      status: "Approved",
    },
    include: [
      {
        model: BMR_Tab,
        where: { isActive: true },
        required: true,
        include: [
          {
            model: BMR_section,
            where: { isActive: true },
            required: true,
            include: [
              {
                model: BMR_field,
                where: { isActive: true },
                required: true,
                attributes: [
                  "label",
                  "isRequired",
                  "field_type",
                  "acceptsMultiple",
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  if (!bmrForm) {
    throw new Error("Approved BMR form not found.");
  }

  // Extract and parse fields
  const fields = [];
  bmrForm.BMR_Tabs.forEach((tab) => {
    tab.BMR_sections.forEach((section) => {
      section.BMR_fields.forEach((field) => {
        if (field.acceptsMultiple) {
          field.acceptsMultiple = JSON.parse(field.acceptsMultiple); // Parse JSON string into object/array
        }
        fields.push(field);
      });
    });
  });

  return fields;
};

exports.createBmrRecord = async (req, res) => {
  const { bmr_id, data, reviewers, approvers } = req.body;

  if (!bmr_id || !data || !reviewers || !approvers) {
    return res.status(400).json({
      error: true,
      message: "Please provide BMR ID, reviewers, approvers bmr data to create a record.",
    });
  }

  const transaction = await sequelize.transaction();

  try {
    const fields = await getAllFieldsForBMR(bmr_id); // Use the previously defined function

    const validData = {};
    fields.forEach((field) => {
      const value = data[field.label];
      if (field.isRequired && (value === undefined || value === null)) {
        throw new Error(`Missing required field: ${field.label}`);
      }

      // Validate field types
      if (
        (field.field_type === "single_select" ||
          field.field_type === "multi_select") &&
        !field.acceptsMultiple.includes(value)
      ) {
        throw new Error(`Invalid value for field ${field.label}`);
      }
      if (field.field_type === "grid") {
        if (typeof value !== "object" || !Array.isArray(value)) {
          throw new Error(
            `Expected array of objects for grid field ${field.label}`
          );
        }
        // Further validation to ensure each object in the array matches the structure expected by the grid
      }

      validData[field.label] = value;
    });

    console.log(validData);
    

    const newRecord = await BMRRecord.create(
      {
        bmr_id,
        data: validData,
        status: "Initiation",
        stage: 1,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(200).json({
      error: false,
      message: "Record created successfully in the initiation stage",
      record: newRecord,
    });
  } catch (e) {
    await transaction.rollback();
    res.status(500).json({
      error: true,
      message: `Error creating record: ${e.message}`,
    });
  }
};

exports.updateBMRRecord = async (req, res) => {
  const { record_id, updatedData } = req.body;

  if (!record_id || !updatedData) {
    return res.status(400).json({
      error: true,
      message: "Please provide record ID and the data to update.",
    });
  }

  const transaction = await sequelize.transaction();

  try {
    const record = await BMRRecord.findOne({
      where: { id: record_id, status: "Initiation", isActive: true },
      transaction,
    });

    if (!record) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "Record not found or is not in the initiation stage.",
      });
    }

    const fields = await getAllFieldsForBMR(record.bmr_id); // Assuming this function returns fields with parsed 'acceptsMultiple'
    const validData = {};
    const errors = [];

    fields.forEach((field) => {
      const value = updatedData[field.label];
      if (field.isRequired && (value === undefined || value === null)) {
        errors.push(`Missing required field: ${field.label}`);
      }

      // Validate based on field type
      if (
        field.field_type === "single_select" ||
        field.field_type === "multi_select"
      ) {
        if (
          field.field_type === "single_select" &&
          !field.acceptsMultiple.includes(value)
        ) {
          errors.push(`Invalid value for field ${field.label}`);
        }
        if (
          field.field_type === "multi_select" &&
          !value.every((val) => field.acceptsMultiple.includes(val))
        ) {
          errors.push(`Invalid values for field ${field.label}`);
        }
      } else if (field.field_type === "grid") {
        // Assuming value is an array of objects for grids
        if (!Array.isArray(value)) {
          errors.push(`Expected array for grid field ${field.label}`);
        }
      }

      validData[field.label] = value;
    });

    if (errors.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: errors.join(", "),
      });
    }

    // Apply updates, merging with existing data
    await record.update(
      { data: { ...record.data, ...validData } },
      { transaction }
    );

    await transaction.commit();

    res.status(200).json({
      error: false,
      message: "Record updated successfully.",
      record,
    });
  } catch (e) {
    await transaction.rollback();
    res.status(500).json({
      error: true,
      message: `Error updating record: ${e.message}`,
    });
  }
};

exports.sendRecordForReview = async (req, res) => {
  const { record_id, email, password, initiatorComment } = req.body;

  if (!record_id || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "Please provide record ID, email, and password.",
    });
  }

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({
      where: { email, isActive: true },
      transaction,
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid credentials." });
    }

    const record = await BMRRecord.findOne({
      where: { id: record_id, status: "Initiation", isActive: true },
      transaction,
    });
    if (!record) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "Record not found or not in initiation stage.",
      });
    }

    await record.update(
      {
        status: "Under Review",
        stage: 2,
        initiatorComment,
      },
      { transaction }
    );

    // Send emails to reviewers
    const emailPromises = record.reviewers.map((reviewer) => {
      // Fetch reviewer data and send email logic here
    });

    await Promise.all(emailPromises);
    await transaction.commit();

    res.status(200).json({ error: false, message: "Record sent for review." });
  } catch (e) {
    await transaction.rollback();
    res.status(500).json({
      error: true,
      message: `Error during review process: ${e.message}`,
    });
  }
};

exports.sendFromReviewToOpen = async (req, res) => {
  const { record_id, email, password } = req.body;

  if (!record_id || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "Please provide record ID, email, and password.",
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Verify user credentials
    const user = await User.findOne({
      where: { email, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Find the record
    const record = await BMRRecord.findOne({
      where: { id: record_id, status: "Under Review", isActive: true },
      transaction,
    });

    if (!record) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "Record not found or not under review.",
      });
    }

    // Reset reviewers' status and return the record to "Initiation"
    const updatedReviewers = record.reviewers.map((reviewer) => ({
      ...reviewer,
      status: "pending",
      comment: null, // Optionally reset the comment
    }));

    await record.update(
      {
        status: "Under Initiation",
        stage: 1,
        reviewers: updatedReviewers,
      },
      { transaction }
    );

    // Optionally send a notification email to the initiator or other relevant users
    // (e.g., Mailer.sendEmail('reminderInitiator', { ...mailData }))

    await transaction.commit();
    res.status(200).json({
      error: false,
      message: "Record status successfully reset from review to initiation.",
    });
  } catch (e) {
    await transaction.rollback();
    res.status(500).json({
      error: true,
      message: `Error resetting record status: ${e.message}`,
    });
  }
};

exports.sendFromReviewToApproval = async (req, res) => {
  const { record_id, reviewComment, password } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({
      where: { user_id: req.user.userId, isActive: true },
      transaction,
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid credentials." });
    }

    const record = await BMRRecord.findOne({
      where: { id: record_id, status: "Under Review", isActive: true },
      transaction,
    });
    if (!record) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "Record not found or not under review.",
      });
    }

    let alreadyReviewed = false;
    const updatedReviewers = record.reviewers.map((reviewer) => {
      if (reviewer.reviewerId === user.user_id) {
        if (reviewer.status === "reviewed") {
          alreadyReviewed = true;
          return reviewer;
        } else {
          return { ...reviewer, status: "reviewed", comment: reviewComment };
        }
      }
      return reviewer;
    });

    if (alreadyReviewed) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "You have already reviewed this record.",
      });
    }

    const allReviewed = updatedReviewers.every(
      (reviewer) => reviewer.status === "reviewed"
    );

    await record.update(
      {
        reviewers: updatedReviewers,
        ...(allReviewed && { status: "Under Approval", stage: 3 }),
      },
      { transaction }
    );

    if (allReviewed) {
      // Send emails to approvers
      const emailPromises = record.approvers.map((approver) => {
        // Fetch approver data and send email logic here
      });
      await Promise.all(emailPromises);
    }

    await transaction.commit();
    res
      .status(200)
      .json({ error: false, message: "Record reviewed successfully." });
  } catch (e) {
    await transaction.rollback();
    res
      .status(500)
      .json({ error: true, message: `Error during review: ${e.message}` });
  }
};

exports.sendFromApprovalToOpen = async (req, res) => {
  const { record_id, email, password } = req.body;

  if (!record_id || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "Please provide record ID, email, and password.",
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Verify user credentials
    const user = await User.findOne({
      where: { email, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Find the record
    const record = await BMRRecord.findOne({
      where: { id: record_id, status: "Under Approval", isActive: true },
      transaction,
    });

    if (!record) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "Record not found or not under approval.",
      });
    }

    // Reset reviewers' and approvers' status and return the record to "Initiation"
    const updatedReviewers = record.reviewers.map((reviewer) => ({
      ...reviewer,
      status: "pending",
      comment: null, // Optionally reset the comment
    }));

    const updatedApprovers = record.approvers.map((approver) => ({
      ...approver,
      status: "pending",
      comment: null, // Optionally reset the comment
    }));

    await record.update(
      {
        status: "Under Initiation",
        stage: 1,
        reviewers: updatedReviewers,
        approvers: updatedApprovers,
      },
      { transaction }
    );

    // Optionally send a notification email to the initiator or other relevant users
    // (e.g., Mailer.sendEmail('reminderInitiator', { ...mailData }))

    await transaction.commit();
    res.status(200).json({
      error: false,
      message: "Record status successfully reset from approval to initiation.",
    });
  } catch (e) {
    await transaction.rollback();
    res.status(500).json({
      error: true,
      message: `Error resetting record status: ${e.message}`,
    });
  }
};

exports.approveBMR = async (req, res) => {
  const { record_id, approvalComment, password } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({
      where: { user_id: req.user.userId, isActive: true },
      transaction,
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid credentials." });
    }

    const record = await BMRRecord.findOne({
      where: { id: record_id, status: "Under Approval", isActive: true },
      transaction,
    });
    if (!record) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "Record not found or not under approval.",
      });
    }

    let alreadyApproved = false;
    const updatedApprovers = record.approvers.map((approver) => {
      if (approver.approverId === user.user_id) {
        if (approver.status === "approved") {
          alreadyApproved = true;
          return approver;
        } else {
          return { ...approver, status: "approved", comment: approvalComment };
        }
      }
      return approver;
    });

    if (alreadyApproved) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "You have already approved this record.",
      });
    }

    const allApproved = updatedApprovers.every(
      (approver) => approver.status === "approved"
    );

    await record.update(
      {
        approvers: updatedApprovers,
        ...(allApproved && { status: "Approved", stage: 4 }),
      },
      { transaction }
    );

    await transaction.commit();
    res
      .status(200)
      .json({ error: false, message: "Record approved successfully." });
  } catch (e) {
    await transaction.rollback();
    res
      .status(500)
      .json({ error: true, message: `Error during approval: ${e.message}` });
  }
};
