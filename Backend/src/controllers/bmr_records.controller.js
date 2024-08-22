const BMRRecord = require("../models/bmr_records.model");
const User = require("../models/user.model");
const BMR = require("../models/bmr.model");
const BMR_Tab = require("../models/bmr_tabs.model");
const BMR_section = require("../models/bmr_sections.model");
const BMR_field = require("../models/bmr_fields.model");
const { sequelize } = require("../config/db");
const Mailer = require("../middlewares/mailer");

const getUserById = async (user_id) => {
  const user = await User.findOne({ where: { user_id, isActive: true } });
  return user;
};

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
      message:
        "Please provide BMR ID, reviewers, approvers bmr data to create a record.",
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

    const newRecord = await BMRRecord.create(
      {
        bmr_id,
        data: validData,
        status: "Initiation",
        stage: 1,
        initiator: req.user.userId,
      },
      { transaction }
    );

    const bmr = await BMR.findOne({
      where: {
        bmr_id: bmr_id,
        isActive: true,
      },
    });

    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const dateOfInitiation = `${day}-${month}-${year}`;

    const taggedReviewers = reviewers.map((person) => ({
      ...person,
      role: "reviewer",
    }));
    const taggedApprovers = approvers.map((person) => ({
      ...person,
      role: "approver",
    }));

    const emailPromises = taggedReviewers
      .concat(taggedApprovers)
      .map(async (person) => {
        const userId =
          person.role === "reviewer" ? person.reviewerId : person.approverId;
        try {
          const userData = await getUserById(userId);
          const initiatorData = await getUserById(bmr.initiator);

          const mailData = {
            bmrName: bmr.name,
            initiator: initiatorData.get("name"),
            dateOfInitiation: dateOfInitiation,
            status: "Initiation",
            userName: userData.get("name"),
            userEmail: userData.get("email"),
            recipients: userData.get("email"),
            ...(person.role === "reviewer"
              ? { reviewerName: userData.get("name") }
              : { approverName: userData.get("name") }),
          };

          await Mailer.sendEmail(
            person.role === "reviewer" ? "assignReviewer" : "assignApprover",
            mailData
          );
        } catch (emailError) {
          // Log the error and proceed with other emails
          console.error("Failed to send email:", emailError.message);
          throw new Error("Failed to send emails");
        }
      });

    await Promise.all(emailPromises);
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

    const form = await BMR.findOne({
      where: {
        bmr_id: record.bmr_id,
        isActive: true,
      },
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

    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const dateOfInitiation = `${day}-${month}-${year}`;

    const emailPromises = record?.reviewers.map(async (person) => {
      const userData = await getUserById(person.reviewerId);
      const initiatorData = await getUserById(record.initiator);

      const mailData = {
        bmrName: form.name,
        initiator: initiatorData.get("name"), // Use .get() to safely extract properties
        dateOfInitiation: dateOfInitiation,
        status: "Under Review",
        recipients: userData.get("email"),
        reviewerName: userData.get("name"),
      };

      try {
        Mailer.sendEmail("reminderReviewer", mailData);
      } catch (emailError) {
        throw new Error("Failed to send emails: " + emailError.message); // Throw to catch in outer try-catch
      }
    });

    await Promise.all(emailPromises);
    await transaction.commit(); // Commit the transaction

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

    const form = await BMR.findOne({
      where: {
        bmr_id: record.bmr_id,
        isActive: true,
      },
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

    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const dateOfInitiation = `${day}-${month}-${year}`;

    const initiator = await getUserById(record.initiator, { transaction });
    if (!initiator) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ error: true, message: "Initiator not found." });
    }

    // Prepare mail data for the initiator
    const mailData = {
      bmrName: form.name,
      initiator: initiator.get("name"),
      dateOfInitiation: dateOfInitiation,
      status: "Under Initiation",
      initiatorName: initiator.get("name"),
      recipients: initiator.get("email"),
    };

    // Send email to the initiator
    try {
      Mailer.sendEmail("reminderInitiator", mailData);
    } catch (emailError) {
      throw new Error(
        "Failed to send email to initiator: " + emailError.message
      );
    }

    // Commit the transaction
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

    const form = await BMR.findOne({
      where: {
        bmr_id: record.bmr_id,
        isActive: true,
      },
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
      const date = new Date();
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const dateOfInitiation = `${day}-${month}-${year}`;

      // If all reviewers have reviewed, send emails to approvers
      const emailPromises = record.approvers.map(async (approver) => {
        const approverData = await getUserById(approver.approverId);
        const initiatorData = await getUserById(record.initiator);
        const mailData = {
          bmrName: form.name,
          dateOfInitiation: dateOfInitiation,
          status: "Under Approval",
          initiator: initiatorData.get("name"),
          approverName: approverData.get("name"),
          recipients: approverData.get("email"),
        };

        try {
          Mailer.sendEmail("reminderApprover", mailData);
        } catch (emailError) {
          throw new Error(
            "Failed to send email to approver: " + emailError.message
          );
        }
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

    const form = await BMR.findOne({
      where: {
        bmr_id: record.bmr_id,
        isActive: true,
      },
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

    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const dateOfInitiation = `${day}-${month}-${year}`;

    const initiator = await getUserById(form.initiator, { transaction });
    if (!initiator) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ error: true, message: "Initiator not found." });
    }

    // Prepare mail data for the initiator
    const mailData = {
      bmrName: form.name,
      initiator: initiator.get("name"),
      dateOfInitiation: dateOfInitiation,
      status: "Under Initiation",
      initiatorName: initiator.get("name"),
      recipients: initiator.get("email"),
    };

    // Send email to the initiator
    try {
      Mailer.sendEmail("reminderInitiator", mailData);
    } catch (emailError) {
      throw new Error(
        "Failed to send email to initiator: " + emailError.message
      );
    }

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
