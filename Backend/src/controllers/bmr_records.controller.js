const BMRRecord = require("../models/bmr_records.model");
const User = require("../models/user.model");
const BMR = require("../models/bmr.model");
const BMR_Tab = require("../models/bmr_tabs.model");
const BMR_section = require("../models/bmr_sections.model");
const BMR_field = require("../models/bmr_fields.model");
const { sequelize } = require("../config/db");
const Mailer = require("../middlewares/mailer");
const bcrypt = require("bcrypt");
const RecordAuditTrail = require("../models/records_auditTrail.model");

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
  bmrForm?.BMR_Tabs?.forEach((tab) => {
    tab?.BMR_sections?.forEach((section) => {
      section?.BMR_fields?.forEach((field) => {
        // if (field.acceptsMultiple) {
        //   field.acceptsMultiple = JSON.parse(field.acceptsMultiple); // Parse JSON string into object/array
        // }
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
    const fields = await getAllFieldsForBMR(bmr_id);

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
        status: "Under Initiation",
        stage: 1,
        initiator: req.user.userId,
        reviewers: reviewers,
        approvers: approvers,
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

exports.deleteBMRRecord = async (req, res) => {
  const bmrRecordId = req.params.id;
  const { password, declaration, comments } = req.body;

  // Validate password and declaration before starting the transaction
  if (!password || !declaration) {
    return res
      .status(401)
      .json({ error: true, message: "Invalid email or password." });
  }

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    const user = await User.findOne({
      where: { user_id: req.user.userId, isActive: true },
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

    // Check if the BMR exists and is active
    const BmrRecord = await BMRRecord.findOne({
      where: { record_id: bmrRecordId, isActive: true },
      transaction,
    });

    if (!BmrRecord) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "BMR record not found",
      });
    }

    // Mark the BMR as inactive
    await BMRRecord.update(
      { isActive: false },
      {
        where: { record_id: bmrRecordId },
        transaction,
      }
    );

    // Log audit trail synchronously to ensure consistency within the transaction
    try {
      await RecordAuditTrail.create(
        {
          record_id: bmrRecordId,
          field_name: "Not Applicable",
          changed_by: req.user.userId,
          previous_value: "Active",
          new_value: "Inactive",
          previous_status: "Under Initiation",
          new_status: "Under Initiation",
          declaration: declaration,
          comments: comments,
          action: "BMR Record Deleted",
        },
        { transaction }
      );
    } catch (auditError) {
      console.error("Failed to log audit trail:", auditError.message);
      await transaction.rollback();
      return res.status(500).json({
        error: true,
        message: `Error logging audit trail: ${auditError.message}`,
      });
    }

    await transaction.commit(); // Commit the transaction

    res.json({
      error: false,
      message: "BMR Record deleted successfully",
    });
  } catch (err) {
    await transaction.rollback(); // Rollback the transaction on error
    res.status(500).json({
      error: true,
      message: `Error deleting BMR Record: ${err.message}`,
    });
  }
};

exports.getAllBMRRecords = async (req, res) => {
  BMRRecord.findAll({
    where: {
      isActive: true,
    },
    include: [
      {
        model: BMR,
        attributes: ["name", "division_id"],
      },
      {
        model: User,
        as: "InitiatorUser", // Use the alias defined in the association
      },
    ],
  })
    .then((result) => {
      res.status(200).json({
        error: false,
        message: result,
      });
    })
    .catch((e) => {
      res.status(500).json({
        error: true,
        message: `Error getting records: ${e.message}`,
      });
    });
};

exports.sendRecordForReview = async (req, res) => {
  const {
    record_id,
    email,
    password,
    initiatorComment,
    declaration,
    comments,
  } = req.body;

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
      where: { record_id: record_id, isActive: true },
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

    await RecordAuditTrail.create(
      {
        record_id: record_id,
        changed_by: req.user.userId,
        field_name: "Stage Change",
        previous_value: "Not Applicable",
        new_value: "Not Applicable",
        previous_status: "Under Initiation",
        new_status: "Under Review",
        declaration: declaration,
        comments: comments,
        action: "Send for Review",
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
        initiator: initiatorData.get("name"),
        dateOfInitiation: dateOfInitiation,
        status: "Under Review",
        recipients: userData.get("email"),
        reviewerName: userData.get("name"),
      };

      try {
        Mailer.sendEmail("reminderReviewer", mailData);
      } catch (emailError) {
        throw new Error("Failed to send emails: " + emailError.message);
      }
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
  const { record_id, email, password, comments, declaration } = req.body;

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

    const record = await BMRRecord.findOne({
      where: { record_id: record_id, isActive: true },
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

    const updatedReviewers = record.reviewers.map((reviewer) => ({
      ...reviewer,
      status: "pending",
      comment: null,
      date_of_review: "NA",
    }));

    await record.update(
      {
        status: "Under Initiation",
        stage: 1,
        reviewers: updatedReviewers,
      },
      { transaction }
    );

    await RecordAuditTrail.create(
      {
        record_id: record_id,
        changed_by: req.user.userId,
        field_name: "Stage Change",
        previous_value: "Not Applicable",
        new_value: "Not Applicable",
        previous_status: "Under Review",
        new_status: "Under Initiation",
        declaration: declaration,
        comments: comments,
        action: "Send from Review to Open",
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
  const { record_id, reviewComment, password, comments, declaration } =
    req.body;

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
      where: { record_id: record_id, isActive: true },
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
          return {
            ...reviewer,
            status: "reviewed",
            comment: reviewComment,
            date_of_review: new Date(),
          };
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

    await RecordAuditTrail.create(
      {
        record_id: record_id,
        changed_by: req.user.userId,
        field_name: "Stage Change",
        previous_value: "Not Applicable",
        new_value: "Not Applicable",
        previous_status: "Under Review",
        new_status: allReviewed ? "Reviewed" : "Under Review",
        declaration: declaration,
        comments: comments,
        action: "Review BMR form",
      },
      { transaction }
    );

    if (allReviewed) {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const dateOfInitiation = `${day}-${month}-${year}`;
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
  const { record_id, email, password, comments, declaration } = req.body;

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

    const record = await BMRRecord.findOne({
      where: { record_id: record_id, isActive: true },
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

    const updatedReviewers = record.reviewers.map((reviewer) => ({
      ...reviewer,
      status: "pending",
      comment: null,
      date_of_review: "NA",
    }));

    const updatedApprovers = record.approvers.map((approver) => ({
      ...approver,
      status: "pending",
      comment: null,
      date_of_approval: "NA",
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

    await RecordAuditTrail.create(
      {
        record_id: record_id,
        changed_by: req.user.userId,
        field_name: "Stage Change",
        previous_value: "Not Applicable",
        new_value: "Not Applicable",
        previous_status: "Under Approval",
        new_status: "Under Initiation",
        declaration: declaration,
        comments: comments,
        action: "Send from Approval To Open",
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
  const { record_id, approvalComment, password, comments, declaration } =
    req.body;

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
      where: {
        record_id: record_id,
        isActive: true,
      },
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
          return {
            ...approver,
            status: "approved",
            comment: approvalComment,
            date_of_approval: new Date(),
          };
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

    await RecordAuditTrail.create(
      {
        record_id: record_id,
        changed_by: req.user.userId,
        field_name: "Stage Change",
        previous_value: "Not Applicable",
        new_value: "Not Applicable",
        previous_status: "Under Approval",
        new_status: allApproved ? "Approved" : "Under Approval",
        declaration: declaration,
        comments: comments,
        action: "Approve BMR Record",
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

exports.genrateBMRrecord = async (req, res) => {
  try {
    let reportData = req.body.reportData;
    let initiator_name = await getUserById(reportData?.initiator);
    reportData.initiator_name = initiator_name?.name;

    const getCurrentDateTime = () => {
      const now = new Date();
      return now.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    };

    const html = await new Promise((resolve, reject) => {
      res.render("bmr_record_report", { reportData }, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

    const browser = await puppeteer.launch({
      headless: true,
      timeout: 120000,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const logoPath = path.join(__dirname, "../public/vidyalogo.png.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    const logoDataUri = `data:image/png;base64,${logoBase64}`;

    const user = await getUserById(req.user.userId);

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div class="header-container">
          <table class="header-table">
            <tr>
              <th colspan="2" class="header-title">BMR Form Report</th>
              <th rowspan="1" class="header-logo">
                <img src="${logoDataUri}" alt="Logo" style="height: 60px; width: auto;" />
              </th>
            </tr>
            <tr>
              <td class="header-info">BMR ID: ${reportData.bmr_id}</td>
              <td class="header-info">BMR Name: ${reportData?.name}</td>
              <td class="header-info">Status: ${reportData?.status}</td>
            </tr>
          </table>
        </div>
        <style>
          .header-container {
            width: 100%;
            padding: 0 50px;
            box-sizing: border-box;
          }
          .header-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 14px;
            table-layout: fixed;
          }
          .header-table th, .header-table td {
            border: 1px solid #000;
            padding: 8px;
          }
          .header-title {
            text-align: center;
            font-size: 18px;
            margin: 10px 0;
          }
          .header-info {
            font-size: 12px;
            text-align: center;
          }
        </style>
      `,
      footerTemplate: `
        <style>
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            font-size: 10px;
            padding: 5px 0;
          }
          .leftContent, .centerContent, .rightContent {
            display: inline-block;
          }
          .centerContent {
            flex-grow: 1;
            text-align: center;
          }
          .leftContent {
            flex-grow: 0;
            padding-left: 20px;
          }
          .rightContent {
            flex-grow: 0;
            padding-right: 20px;
          }
        </style>
        <div class="footer">
          <span class="leftContent">Printed on: ${getCurrentDateTime()}</span>
          <span class="centerContent">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
          <span class="rightContent">Printed by: ${
            user ? user.name : "Unknown"
          }</span>
        </div>
      `,
      margin: {
        top: "120px",
        bottom: "60px",
        right: "30px",
        left: "30px",
      },
    });
    //   fs.writeFileSync("report.pdf", pdf);
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="report.pdf"',
      "Cache-Control": "no-store",
      Pragma: "no-cache",
    });
    res.set("Content-Length", Buffer.byteLength(pdf));

    res.send(Buffer.from(pdf));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
};
