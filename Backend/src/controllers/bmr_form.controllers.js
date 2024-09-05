const BMR = require("../models/bmr.model");
const BMR_field = require("../models/bmr_fields.model");
const BMR_Tab = require("../models/bmr_tabs.model");
const BMR_section = require("../models/bmr_sections.model");
const UserRole = require("../models/userRole.model");
const { sequelize } = require("../config/db");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const Mailer = require("../middlewares/mailer");
const FormAuditTrail = require("../models/form_audittrail.model");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const getUserById = async (user_id) => {
  const user = await User.findOne({ where: { user_id, isActive: true } });
  return user;
};

exports.postBMR = async (req, res) => {
  const { name, reviewers, approvers, password, declaration } = req.body;

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    // Validate password and declaration
    if (!password || !declaration) {
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

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

    // Validate input
    if (
      !name ||
      !Array.isArray(reviewers) ||
      !Array.isArray(approvers) ||
      reviewers.length === 0 ||
      approvers.length === 0
    ) {
      return res.status(400).json({
        error: true,
        message:
          "Please provide all necessary BMR details including name, reviewers, and approvers.",
      });
    }

    // Check if BMR name already exists
    const existingBMR = await BMR.findOne({
      where: { name: name, isActive: true },
      transaction,
    });

    if (existingBMR) {
      await transaction.rollback(); // Roll back the transaction
      return res.status(409).json({
        error: true,
        message: "A BMR with the same name already exists.",
      });
    }

    // Create the BMR record
    const bmr = await BMR.create(
      {
        name: name,
        reviewers: reviewers,
        approvers: approvers,
        initiator: req.user.userId,
        stage: 1,
        status: "Under Initiation",
      },
      { transaction }
    );

    // Log audit trail
    try {
      await FormAuditTrail.create(
        {
          bmr_id: bmr.bmr_id,
          changed_by: req.user.userId,
          previous_value: null,
          new_value: JSON.stringify(name),
          previous_status: "Not Applicable",
          new_status: "Under Initiation",
          declaration: declaration,
          action: "BMR Created",
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

    // Send emails in the background to avoid delaying the response
    Promise.all(
      taggedReviewers.concat(taggedApprovers).map(async (person) => {
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

          // await Mailer.sendEmail(
          //   person.role === "reviewer" ? "assignReviewer" : "assignApprover",
          //   mailData
          // );
        } catch (emailError) {
          // Log the error but don't throw it to ensure transaction commits
          console.error("Failed to send email:", emailError.message);
        }
      })
    );

    // Commit the transaction
    await transaction.commit();

    // Send success response
    res.status(200).json({
      error: false,
      message: "BMR Created successfully",
    });
  } catch (e) {
    await transaction.rollback();
    res.status(500).json({
      error: true,
      message: `Error creating BMR: ${e.message}`,
    });
  }
};

exports.postBMRTab = async (req, res) => {
  const { bmr_id, tab_name, password, declaration } = req.body;

  // Validate password and declaration
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

    // Check for missing fields
    if (!bmr_id || !tab_name) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Please provide proper details.",
      });
    }

    // Check if a tab with the same name already exists for this BMR
    const existingTab = await BMR_Tab.findOne({
      where: {
        bmr_id: bmr_id,
        tab_name: tab_name,
        isActive: true,
      },
      transaction,
    });

    if (existingTab) {
      await transaction.rollback();
      return res.status(409).json({
        error: true,
        message: "A tab with the same name already exists for this BMR.",
      });
    }

    // Create the new BMR tab if no conflicts are found
    const newTab = await BMR_Tab.create(
      {
        bmr_id: bmr_id,
        tab_name: tab_name,
      },
      { transaction }
    );

    // Log audit trail synchronously to ensure consistency within the transaction
    try {
      await FormAuditTrail.create(
        {
          bmr_id: bmr_id,
          changed_by: req.user.userId,
          previous_value: null,
          new_value: JSON.stringify(tab_name),
          previous_status: "Under Initiation",
          new_status: "Under Initiation",
          declaration: declaration,
          action: "Tab Added",
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

    return res.status(200).json({
      error: false,
      message: "BMR Tab created successfully!",
    });
  } catch (e) {
    await transaction.rollback(); // Rollback the transaction on error
    return res.status(500).json({
      error: true,
      message: `Error creating BMR Tab: ${e.message}`,
    });
  }
};

exports.postBMRSection = async (req, res) => {
  const { bmr_id, bmr_tab_id, section_name, limit, password, declaration } =
    req.body;

  // Validate password and declaration
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

    // Validate provided details
    if (!bmr_id || !bmr_tab_id || !section_name || !limit) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Please provide proper details.",
      });
    }

    // Check for existing section with the same name under the same BMR and tab
    const existingSection = await BMR_section.findOne({
      where: {
        bmr_id: bmr_id,
        bmr_tab_id: bmr_tab_id,
        section_name: section_name,
        isActive: true,
      },
      transaction,
    });

    if (existingSection) {
      await transaction.rollback();
      return res.status(409).json({
        error: true,
        message:
          "A section with the same name already exists under the specified BMR and tab.",
      });
    }

    // Create the BMR section if no conflict is found
    const newSection = await BMR_section.create(
      {
        bmr_id: bmr_id,
        bmr_tab_id: bmr_tab_id,
        section_name: section_name,
        limit: limit,
      },
      { transaction }
    );

    // Log audit trail synchronously to ensure consistency within the transaction
    try {
      await FormAuditTrail.create(
        {
          bmr_id: bmr_id,
          changed_by: req.user.userId,
          previous_value: null,
          new_value: JSON.stringify(section_name),
          previous_status: "Under Initiation",
          new_status: "Under Initiation",
          declaration: declaration,
          action: "Section Added",
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

    // Send success response
    return res.status(200).json({
      error: false,
      message: "BMR Section created successfully!",
    });
  } catch (e) {
    await transaction.rollback(); // Rollback the transaction on error
    return res.status(500).json({
      error: true,
      message: `Error creating BMR Section: ${e.message}`,
    });
  }
};

exports.postBMRField = async (req, res) => {
  const {
    bmr_id,
    bmr_tab_id,
    bmr_section_id,
    field_type,
    label,
    placeholder,
    defaultValue,
    helpText,
    minValue,
    maxValue,
    order,
    isVisible,
    isRequired,
    isReadOnly,
    acceptsMultiple, // This will now potentially hold either options or grid definitions
    password,
    declaration,
  } = req.body;

  // Validate password and declaration
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

    // Check for required fields
    if (
      !bmr_id ||
      !bmr_tab_id ||
      !bmr_section_id ||
      !label ||
      isRequired === undefined
    ) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Please provide proper details.",
      });
    }

    // Check if a field with the same label already exists within the same section, tab, and BMR
    const existingField = await BMR_field.findOne({
      where: {
        bmr_id: bmr_id,
        bmr_tab_id: bmr_tab_id,
        bmr_section_id: bmr_section_id,
        label: label,
        isActive: true,
      },
      transaction,
    });

    if (existingField) {
      await transaction.rollback();
      return res.status(409).json({
        error: true,
        message: "A field with the same label already exists in this section.",
      });
    }

    let formattedAcceptsMultiple = acceptsMultiple;

    // Conditionally format acceptsMultiple based on the field_type
    if (field_type === "single_select" || field_type === "multi_select") {
      // Ensure that acceptsMultiple is an array of options
      if (!Array.isArray(acceptsMultiple)) {
        await transaction.rollback();
        return res.status(400).json({
          error: true,
          message:
            "For 'single_select' or 'multi_select' types, acceptsMultiple must be an array of options.",
        });
      }
      formattedAcceptsMultiple = JSON.stringify(acceptsMultiple);
    } else if (field_type === "grid") {
      // Ensure that acceptsMultiple contains grid column definitions
      if (
        typeof acceptsMultiple !== "object" ||
        !Array.isArray(acceptsMultiple.columns)
      ) {
        await transaction.rollback();
        return res.status(400).json({
          error: true,
          message:
            "For 'grid' type, acceptsMultiple must contain an object with a 'columns' array.",
        });
      }
      formattedAcceptsMultiple = JSON.stringify(acceptsMultiple);
    }

    // Create the BMR field if no conflict is found
    const newField = await BMR_field.create(
      {
        bmr_id: bmr_id,
        bmr_tab_id: bmr_tab_id,
        bmr_section_id: bmr_section_id,
        field_type: field_type,
        label: label,
        placeholder: placeholder,
        defaultValue: defaultValue,
        helpText: helpText,
        minValue: minValue,
        maxValue: maxValue,
        order: order,
        isVisible: isVisible,
        isRequired: isRequired,
        isReadOnly: isReadOnly,
        acceptsMultiple: formattedAcceptsMultiple,
      },
      { transaction }
    );

    // Log audit trail synchronously to ensure consistency within the transaction
    try {
      await FormAuditTrail.create(
        {
          bmr_id: bmr_id,
          changed_by: req.user.userId,
          previous_value: null,
          new_value: JSON.stringify(label),
          previous_status: "Under Initiation",
          new_status: "Under Initiation",
          declaration: declaration,
          action: "Field Added",
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

    // Send success response
    return res.status(200).json({
      error: false,
      message: "BMR Field created successfully!",
    });
  } catch (e) {
    await transaction.rollback(); // Rollback the transaction on error
    return res.status(500).json({
      error: true,
      message: `Error creating BMR Field: ${e.message}`,
    });
  }
};

exports.editBMR = async (req, res) => {
  const bmr_id = req.params.id;
  const { name, reviewers, approvers, password, declaration } = req.body;

  // Validate password and declaration
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

    // Validate BMR ID
    if (!bmr_id) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Please provide proper BMR details.",
      });
    }

    // Check if a different BMR with the same name already exists
    const existingBMR = await BMR.findOne({
      where: {
        name: name,
        bmr_id: { [Op.ne]: bmr_id }, // Exclude the current BMR from the check
        isActive: true,
      },
      transaction,
    });

    if (existingBMR) {
      await transaction.rollback();
      return res.status(409).json({
        error: true,
        message: "A BMR with the same name already exists.",
      });
    }

    // Fetch the current BMR details
    const currentBMR = await BMR.findOne({
      where: {
        bmr_id: bmr_id,
        isActive: true,
      },
      transaction,
    });

    if (!currentBMR) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "BMR not found.",
      });
    }

    // Proceed with the update if no duplicate name is found
    await BMR.update(
      {
        name: name,
        reviewers: reviewers,
        approvers: approvers,
      },
      { where: { bmr_id: bmr_id }, transaction }
    );

    // Log audit trail synchronously to ensure consistency within the transaction
    try {
      await FormAuditTrail.create(
        {
          bmr_id: bmr_id,
          changed_by: req.user.userId,
          previous_value: JSON.stringify(currentBMR.name),
          new_value: JSON.stringify(name),
          previous_status: "Under Initiation",
          new_status: "Under Initiation",
          declaration: declaration,
          action: "BMR Updated",
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

    // Send success response
    return res.status(200).json({
      error: false,
      message: "BMR updated successfully!",
    });
  } catch (e) {
    await transaction.rollback(); // Rollback the transaction on error
    return res.status(500).json({
      error: true,
      message: `Error updating BMR: ${e.message}`,
    });
  }
};

exports.editBMRTab = async (req, res) => {
  const bmr_tab_id = req.params.id;
  const { bmr_id, tab_name, password, declaration } = req.body;

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    // Validate user credentials
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

    // Validate required fields
    if (!bmr_id || !tab_name) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Please provide proper details.",
      });
    }

    // Check if a different tab with the same name already exists under the same BMR
    const existingTab = await BMR_Tab.findOne({
      where: {
        bmr_id: bmr_id,
        tab_name: tab_name,
        bmr_tab_id: { [Op.ne]: bmr_tab_id }, // Exclude the current tab from the check
        isActive: true,
      },
      transaction,
    });

    if (existingTab) {
      await transaction.rollback();
      return res.status(409).json({
        error: true,
        message: "A tab with the same name already exists for this BMR.",
      });
    }

    // Fetch the current tab details
    const currentTab = await BMR_Tab.findOne({
      where: {
        bmr_tab_id: bmr_tab_id,
        isActive: true,
      },
      transaction,
    });

    if (!currentTab) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "BMR Tab not found.",
      });
    }

    // Proceed with the update if no duplicate tab name is found
    await BMR_Tab.update(
      { tab_name: tab_name },
      { where: { bmr_tab_id: bmr_tab_id }, transaction }
    );

    // Log audit trail synchronously to ensure consistency within the transaction
    try {
      await FormAuditTrail.create(
        {
          bmr_id: bmr_id,
          changed_by: req.user.userId,
          previous_value: JSON.stringify(currentTab.tab_name),
          new_value: JSON.stringify(tab_name),
          previous_status: "Under Initiation",
          new_status: "Under Initiation",
          declaration: declaration,
          action: "Tab Updated",
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

    // Send success response
    return res.status(200).json({
      error: false,
      message: "BMR Tab updated successfully!",
    });
  } catch (e) {
    await transaction.rollback(); // Rollback the transaction on error
    return res.status(500).json({
      error: true,
      message: `Error updating BMR Tab: ${e.message}`,
    });
  }
};

exports.editBMRSection = async (req, res) => {
  const bmr_section_id = req.params.id;
  const { bmr_id, section_name, bmr_tab_id, limit, password, declaration } =
    req.body;

  // Validate password and declaration
  if (!password || !declaration) {
    return res
      .status(401)
      .json({ error: true, message: "Invalid email or password." });
  }

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    // Validate user credentials
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

    // Validate required fields
    if (!bmr_id || !section_name || !bmr_tab_id) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Please provide proper details.",
      });
    }

    // Check if a different section with the same name already exists under the same BMR and tab
    const existingSection = await BMR_section.findOne({
      where: {
        bmr_id: bmr_id,
        bmr_tab_id: bmr_tab_id,
        section_name: section_name,
        bmr_section_id: { [Op.ne]: bmr_section_id }, // Exclude the current section from the check
        isActive: true,
      },
      transaction,
    });

    if (existingSection) {
      await transaction.rollback();
      return res.status(409).json({
        error: true,
        message:
          "A section with the same name already exists under the specified BMR and tab.",
      });
    }

    // Fetch the current section details
    const currentSection = await BMR_section.findOne({
      where: {
        bmr_section_id: bmr_section_id,
        isActive: true,
      },
      transaction,
    });

    if (!currentSection) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "BMR Section not found.",
      });
    }

    // Proceed with the update if no duplicate section name is found
    await BMR_section.update(
      {
        bmr_id: bmr_id,
        bmr_tab_id: bmr_tab_id,
        section_name: section_name,
        limit: limit,
      },
      { where: { bmr_section_id: bmr_section_id }, transaction }
    );

    // Log audit trail synchronously to ensure consistency within the transaction
    try {
      await FormAuditTrail.create(
        {
          bmr_id: bmr_id,
          changed_by: req.user.userId,
          previous_value: JSON.stringify(currentSection.section_name),
          new_value: JSON.stringify(section_name),
          previous_status: "Initiation",
          new_status: "Under Initiation",
          declaration: declaration,
          action: "Section Updated",
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

    // Send success response
    return res.status(200).json({
      error: false,
      message: "BMR Section updated successfully!",
    });
  } catch (e) {
    await transaction.rollback(); // Rollback the transaction on error
    return res.status(500).json({
      error: true,
      message: `Error updating BMR Section: ${e.message}`,
    });
  }
};

exports.editBMRField = async (req, res) => {
  const bmr_field_id = req.params.id;
  const {
    bmr_id,
    bmr_tab_id,
    bmr_section_id,
    field_type,
    label,
    placeholder,
    defaultValue,
    helpText,
    minValue,
    maxValue,
    order,
    isVisible,
    isRequired,
    isReadOnly,
    acceptsMultiple,
    password,
    declaration,
  } = req.body;

  // Validate password and declaration
  if (!password || !declaration) {
    return res
      .status(401)
      .json({ error: true, message: "Invalid email or password." });
  }

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    // Validate user credentials
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

    // Validate required fields
    if (
      !bmr_id ||
      !bmr_tab_id ||
      !bmr_section_id ||
      !label ||
      isRequired === undefined
    ) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Please provide proper details.",
      });
    }

    // Check if a field with the same label already exists within the same section, tab, and BMR
    const existingField = await BMR_field.findOne({
      where: {
        bmr_id: bmr_id,
        bmr_tab_id: bmr_tab_id,
        bmr_section_id: bmr_section_id,
        label: label,
        bmr_field_id: { [Op.ne]: bmr_field_id }, // Exclude the current field from the check
        isActive: true,
      },
      transaction,
    });

    if (existingField) {
      await transaction.rollback();
      return res.status(409).json({
        error: true,
        message: "A field with the same label already exists in this section.",
      });
    }

    let formattedAcceptsMultiple = acceptsMultiple;

    // Format acceptsMultiple based on field_type
    if (field_type === "single_select" || field_type === "multi_select") {
      if (!Array.isArray(acceptsMultiple)) {
        await transaction.rollback();
        return res.status(400).json({
          error: true,
          message:
            "For 'single_select' or 'multi_select' types, acceptsMultiple must be an array of options.",
        });
      }
      formattedAcceptsMultiple = JSON.stringify(acceptsMultiple);
    } else if (field_type === "grid") {
      if (
        typeof acceptsMultiple !== "object" ||
        !Array.isArray(acceptsMultiple.columns)
      ) {
        await transaction.rollback();
        return res.status(400).json({
          error: true,
          message:
            "For 'grid' type, acceptsMultiple must contain an object with a 'columns' array.",
        });
      }
      formattedAcceptsMultiple = JSON.stringify(acceptsMultiple);
    }

    // Proceed with the update
    await BMR_field.update(
      {
        bmr_id: bmr_id,
        bmr_tab_id: bmr_tab_id,
        bmr_section_id: bmr_section_id,
        field_type: field_type,
        label: label,
        placeholder: placeholder,
        defaultValue: defaultValue,
        helpText: helpText,
        minValue: minValue,
        maxValue: maxValue,
        order: order,
        isVisible: isVisible,
        isRequired: isRequired,
        isReadOnly: isReadOnly,
        acceptsMultiple: formattedAcceptsMultiple,
      },
      { where: { bmr_field_id: bmr_field_id }, transaction }
    );

    // Log audit trail synchronously to ensure consistency within the transaction
    try {
      await FormAuditTrail.create(
        {
          bmr_id: bmr_id,
          changed_by: req.user.userId,
          previous_value: JSON.stringify(existingField.label),
          new_value: JSON.stringify(label),
          previous_status: "Under Initiation",
          new_status: "Under Initiation",
          declaration: declaration,
          action: "Field Updated",
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

    res.status(200).json({
      error: false,
      message: "BMR Field updated successfully!",
    });
  } catch (e) {
    await transaction.rollback(); // Rollback the transaction on error
    return res.status(500).json({
      error: true,
      message: `Error updating BMR Field: ${e.message}`,
    });
  }
};

exports.deleteBMR = async (req, res) => {
  const bmrId = req.params.id;
  const { password, declaration } = req.body;

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
    const Bmr = await BMR.findOne({
      where: { bmr_id: bmrId, isActive: true },
      transaction,
    });

    if (!Bmr) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "BMR not found",
      });
    }

    // Mark the BMR as inactive
    await BMR.update(
      { isActive: false },
      {
        where: { bmr_id: bmrId },
        transaction,
      }
    );

    // Log audit trail synchronously to ensure consistency within the transaction
    try {
      await FormAuditTrail.create(
        {
          bmr_id: bmrId,
          changed_by: req.user.userId,
          previous_value: "Active",
          new_value: "Inactive",
          previous_status: "Under Initiation",
          new_status: "Under Initiation",
          declaration: declaration,
          action: "BMR Deleted",
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
      message: "BMR deleted successfully",
    });
  } catch (err) {
    await transaction.rollback(); // Rollback the transaction on error
    res.status(500).json({
      error: true,
      message: `Error deleting BMR: ${err.message}`,
    });
  }
};

exports.deleteBMRTab = async (req, res) => {
  const bmrTabId = req.params.id;
  const { password, declaration } = req.body;

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

    // Check if the BMR Tab exists and is active
    const tab = await BMR_Tab.findOne({
      where: { bmr_tab_id: bmrTabId, isActive: true },
      transaction,
    });

    if (!tab) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "BMR Tab not found",
      });
    }

    // Mark the BMR Tab as inactive
    await BMR_Tab.update(
      { isActive: false },
      {
        where: { bmr_tab_id: bmrTabId },
        transaction,
      }
    );

    // Log audit trail synchronously to ensure consistency within the transaction
    try {
      await FormAuditTrail.create(
        {
          bmr_id: tab.bmr_id,
          changed_by: req.user.userId,
          previous_value: "Active",
          new_value: "Inactive",
          previous_status: "Under Initiation",
          new_status: "Under Initiation",
          declaration: declaration,
          action: "Tab Deleted",
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
      message: "BMR Tab deleted successfully",
    });
  } catch (err) {
    await transaction.rollback(); // Rollback the transaction on error
    res.status(500).json({
      error: true,
      message: `Error deleting BMR Tab: ${err.message}`,
    });
  }
};

exports.deleteBMRSection = async (req, res) => {
  const bmrSectionId = req.params.id;
  const { password, declaration } = req.body;

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

    // Check if the BMR Section exists and is active
    const section = await BMR_section.findOne({
      where: { bmr_section_id: bmrSectionId, isActive: true },
      transaction,
    });

    if (!section) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "BMR Section not found",
      });
    }

    // Mark the BMR Section as inactive
    await BMR_section.update(
      { isActive: false },
      {
        where: { bmr_section_id: bmrSectionId },
        transaction,
      }
    );

    // Log audit trail synchronously to ensure consistency within the transaction
    try {
      await FormAuditTrail.create(
        {
          bmr_id: section.bmr_id,
          changed_by: req.user.userId,
          previous_value: "Active",
          new_value: "Inactive",
          previous_status: "Under Initiation",
          new_status: "Under Initiation",
          declaration: declaration,
          action: "Section Deleted",
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

    res.status(200).json({
      error: false,
      message: "BMR Section deleted successfully",
    });
  } catch (err) {
    await transaction.rollback(); // Rollback the transaction on error
    res.status(500).json({
      error: true,
      message: `Error deleting BMR Section: ${err.message}`,
    });
  }
};

exports.deleteBMRField = async (req, res) => {
  const bmrFieldId = req.params.id;
  const { password, declaration } = req.body;

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

    // Check if the BMR Field exists and is active
    const field = await BMR_field.findOne({
      where: { bmr_field_id: bmrFieldId, isActive: true },
      transaction,
    });

    if (!field) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "BMR Field not found",
      });
    }

    // Mark the BMR Field as inactive
    await BMR_field.update(
      { isActive: false },
      {
        where: { bmr_field_id: bmrFieldId },
        transaction,
      }
    );

    // Log audit trail synchronously to ensure consistency within the transaction
    try {
      await FormAuditTrail.create(
        {
          bmr_id: field.bmr_id,
          changed_by: req.user.userId,
          previous_value: "Active",
          new_value: "Inactive",
          previous_status: "Under Initiation",
          new_status: "Under Initiation",
          declaration: declaration,
          action: "Field Deleted",
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

    res.status(200).json({
      error: false,
      message: "BMR Field deleted successfully",
    });
  } catch (err) {
    await transaction.rollback(); // Rollback the transaction on error
    res.status(500).json({
      error: true,
      message: `Error deleting BMR Field: ${err.message}`,
    });
  }
};

exports.getAllBMR = (req, res) => {
  BMR.findAll({
    where: {
      isActive: true,
    },
    include: [
      {
        model: BMR_Tab,
        where: { isActive: true },
        required: false,
        include: [
          // Include fields within each tab
          {
            model: BMR_section,
            where: { isActive: true },
            required: false,
            include: [
              {
                model: BMR_field,
                where: { isActive: true },
                required: false,
              },
            ],
          },
        ],
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
      res.status(400).json({
        error: true,
        message: `Error while getting BMR: ${e}`,
      });
    });
};

exports.getBMR = (req, res) => {
  BMR.findAll({
    where: {
      bmr_id: req.params.id,
      isActive: true,
    },
    include: [
      {
        model: BMR_Tab,
        where: { isActive: true },
        required: false,
        include: [
          // Include fields within each tab
          {
            model: BMR_section,
            where: { isActive: true },
            required: false,
            include: [
              {
                model: BMR_field,
                where: { isActive: true },
                required: false,
              },
            ],
          },
        ],
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
      res.status(400).json({
        error: true,
        message: `Error while getting BMR: ${e}`,
      });
    });
};

exports.getApprovedBMRs = async (req, res) => {
  BMR.findAll({
    where: {
      stage: 4,
      isActive: true,
    },
    include: [
      {
        model: BMR_Tab,
        where: { isActive: true },
        required: false,
        include: [
          // Include fields within each tab
          {
            model: BMR_section,
            where: { isActive: true },
            required: false,
            include: [
              {
                model: BMR_field,
                where: { isActive: true },
                required: false,
              },
            ],
          },
        ],
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
      res.status(400).json({
        error: true,
        message: `Error while getting approved BMRs: ${e}`,
      });
    });
};

exports.SendBMRForReview = async (req, res) => {
  const { bmr_id, email, password, initiatorComment, declaration } = req.body;

  // Validate required fields
  if (!bmr_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a BMR ID." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    // Verify user credentials
    const user = await User.findOne({
      where: { email: email, isActive: true },
      transaction,
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Find the BMR form
    const form = await BMR.findOne({
      where: { bmr_id, isActive: true },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "BMR not found." });
    }

    if (form.stage !== 1) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Process is not in a valid stage to be sent for review.",
      });
    }

    // Update the form details
    await form.update(
      {
        status: "Under Review",
        stage: 2,
        initiatorComment: initiatorComment,
      },
      { transaction }
    );

    // Log the audit trail synchronously to ensure consistency within the transaction
    await FormAuditTrail.create(
      {
        bmr_id: bmr_id,
        changed_by: req.user.userId,
        previous_value: "Not Applicable",
        new_value: "Not Applicable",
        previous_status: "Under Initiation",
        new_status: "Under Review",
        declaration: declaration,
        action: "Send for Review",
      },
      { transaction }
    );

    await transaction.commit(); // Commit the transaction

    // Send review emails asynchronously
    // const emailPromises = form.reviewers.map(async (person) => {
    //   const userData = await getUserById(person.reviewerId);
    //   const initiatorData = await getUserById(form.initiator);

    //   const mailData = {
    //     bmrName: form.name,
    //     initiator: initiatorData.name,
    //     dateOfInitiation: new Date().toISOString().split("T")[0],
    //     status: "Under Review",
    //     recipients: userData.email,
    //     reviewerName: userData.name,
    //   };

    // //   try {
    // //     await Mailer.sendEmail("reminderReviewer", mailData);
    // //   } catch (emailError) {
    // //     console.error("Failed to send email to reviewer:", emailError.message);
    // //   }
    // });

    // await Promise.all(emailPromises);

    res.status(200).json({
      error: false,
      message: "BMR successfully sent for review",
    });
  } catch (error) {
    // Rollback the transaction only if it hasn't been committed yet
    if (!transaction.finished) {
      await transaction.rollback();
    }
    return res.status(500).json({
      error: true,
      message: `Error during sending process for review: ${error.message}`,
    });
  }
};

exports.SendBMRfromReviewToOpen = async (req, res) => {
  const { bmr_id, email, password, declaration } = req.body;

  // Validate required fields
  if (!bmr_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a BMR ID." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    // Verify user credentials
    const user = await User.findOne({
      where: { user_id: req.user.userId, isActive: true },
      transaction,
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Find the BMR
    const form = await BMR.findOne({
      where: { bmr_id, isActive: true },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "BMR not found." });
    }

    if (form.stage !== 2) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "BMR is not in a valid stage to be sent from review to open.",
      });
    }

    // Update reviewers' status and reset comments
    const updatedReviewers = form.reviewers.map((reviewer) => ({
      ...reviewer,
      status: "pending",
      comment: null,
    }));

    // Update the form details
    await form.update(
      {
        status: "Under Initiation",
        stage: 1,
        reviewers: updatedReviewers,
      },
      { transaction }
    );

    // Log the audit trail synchronously to ensure consistency within the transaction
    try {
      await FormAuditTrail.create(
        {
          bmr_id: bmr_id,
          changed_by: req.user.userId,
          previous_value: "Not Applicable",
          new_value: "Not Applicable",
          previous_status: "Under Review",
          new_status: "Under Initiation",
          declaration: declaration,
          action: "Send from Review to Open",
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

    // Commit the transaction before sending the email
    await transaction.commit(); // Commit the transaction

    // Prepare mail data for the initiator
    const initiator = await getUserById(form.initiator);
    if (!initiator) {
      return res
        .status(404)
        .json({ error: true, message: "Initiator not found." });
    }

    // const date = new Date();
    // const dateOfInitiation = `${String(date.getDate()).padStart(
    //   2,
    //   "0"
    // )}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

    // const mailData = {
    //   bmrName: form.name,
    //   initiator: initiator.get("name"),
    //   dateOfInitiation: dateOfInitiation,
    //   status: "Under Initiation",
    //   initiatorName: initiator.get("name"),
    //   recipients: initiator.get("email"),
    // };

    // // Send email to the initiator asynchronously
    // Mailer.sendEmail("reminderInitiator", mailData).catch((emailError) => {
    //   console.error("Failed to send email to initiator:", emailError.message);
    // });

    return res.status(200).json({
      error: false,
      message: "BMR status successfully changed from review to initiation",
    });
  } catch (error) {
    // Rollback the transaction only if it hasn't been committed yet
    if (!transaction.finished) {
      await transaction.rollback();
    }
    return res.status(500).json({
      error: true,
      message: `Error during changing stage of BMR: ${error.message}`,
    });
  }
};

exports.SendBMRReviewToApproval = async (req, res) => {
  const { bmr_id, reviewComment, password, declaration } = req.body;

  // Validate required fields
  if (!password || !declaration) {
    return res
      .status(401)
      .json({ error: true, message: "Invalid email or password." });
  }

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    // Authenticate the user
    const user = await User.findOne({
      where: { user_id: req.user.userId, isActive: true },
      transaction,
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Retrieve the BMR form
    const form = await BMR.findOne({
      where: { bmr_id, isActive: true },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "BMR not found." });
    }

    if (form.stage !== 2) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "BMR is not in a valid stage to be sent for approval.",
      });
    }

    // Check if the user is assigned as a reviewer and if they have already reviewed
    let alreadyReviewed = false;
    const updatedReviewers = form.reviewers.map((reviewer) => {
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

    if (
      !updatedReviewers.some((reviewer) => reviewer.reviewerId === user.user_id)
    ) {
      await transaction.rollback();
      return res
        .status(403)
        .json({ error: true, message: "Not authorized to review this BMR." });
    }

    if (alreadyReviewed) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: true, message: "You have already reviewed this BMR." });
    }

    // Check if all reviewers have completed their review
    const allReviewed = updatedReviewers.every(
      (reviewer) => reviewer.status === "reviewed"
    );

    // Update the form with new reviewers' statuses and possibly update form status
    const updateData = {
      reviewers: updatedReviewers,
    };

    if (allReviewed) {
      updateData.status = "Under Approval";
      updateData.stage = 3;

      const date = new Date();
      const dateOfInitiation = `${String(date.getDate()).padStart(
        2,
        "0"
      )}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

      // Update the form and commit the transaction
      await form.update(updateData, { transaction });

      // Log the audit trail synchronously to ensure consistency within the transaction
      await FormAuditTrail.create(
        {
          bmr_id: bmr_id,
          changed_by: req.user.userId,
          previous_value: "Not Applicable",
          new_value: "Not Applicable",
          previous_status: "Under Review",
          new_status: "Under Approval",
          declaration: declaration,
          action: "Send from Review to Approval",
        },
        { transaction }
      );

      await transaction.commit(); // Commit the transaction

      // // Prepare and send email to approvers asynchronously
      // const emailPromises = form.approvers.map(async (approver) => {
      //   const approverData = await getUserById(approver.approverId);
      //   const initiatorData = await getUserById(form.initiator);
      //   const mailData = {
      //     bmrName: form.name,
      //     dateOfInitiation: dateOfInitiation,
      //     status: "Under Approval",
      //     initiator: initiatorData.get("name"),
      //     approverName: approverData.get("name"),
      //     recipients: approverData.get("email"),
      //   };

      //   try {
      //     await Mailer.sendEmail("reminderApprover", mailData);
      //   } catch (emailError) {
      //     console.error(
      //       "Failed to send email to approver:",
      //       emailError.message
      //     );
      //   }
      // });

      // await Promise.all(emailPromises);
    } else {
      // If not all reviewers have reviewed, simply update the reviewers' statuses
      await form.update(updateData, { transaction });

      // Log the audit trail synchronously to ensure consistency within the transaction
      await FormAuditTrail.create(
        {
          bmr_id: bmr_id,
          changed_by: req.user.userId,
          previous_value: "Not Applicable",
          new_value: "Not Applicable",
          previous_status: "Under Review",
          new_status: "Under Review",
          declaration: declaration,
          action: "Send from Review to Approval",
        },
        { transaction }
      );

      await transaction.commit(); // Commit the transaction
    }

    res.status(200).json({
      error: false,
      message: allReviewed
        ? "Review completed successfully and BMR moved to approval stage"
        : "Review completed successfully, awaiting other reviewers",
    });
  } catch (error) {
    // Rollback the transaction only if it hasn't been committed yet
    if (!transaction.finished) {
      await transaction.rollback();
    }
    res.status(500).json({
      error: true,
      message: `Error during review: ${error.message}`,
    });
  }
};

exports.SendBMRfromApprovalToOpen = async (req, res) => {
  const { bmr_id, email, password, declaration } = req.body;

  // Validate required fields
  if (!bmr_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a BMR ID." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    // Authenticate user credentials
    const user = await User.findOne({
      where: { user_id: req.user.userId, isActive: true },
      transaction,
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Find the BMR form
    const form = await BMR.findOne({
      where: { bmr_id, isActive: true },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "BMR not found." });
    }

    if (form.stage !== 3) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message:
          "BMR is not in a valid stage to be moved from approval to initiation.",
      });
    }

    // Reset reviewers and approvers to pending status
    const updatedReviewers = form.reviewers.map((reviewer) => ({
      ...reviewer,
      status: "pending",
      comment: null, // Optionally reset the comment
    }));

    const updatedApprovers = form.approvers.map((approver) => ({
      ...approver,
      status: "pending",
      comment: null, // Optionally reset the comment
    }));

    // Update the form status and stages
    await form.update(
      {
        status: "Under Initiation",
        stage: 1,
        reviewers: updatedReviewers,
        approvers: updatedApprovers,
      },
      { transaction }
    );

    // Log the audit trail synchronously to ensure consistency within the transaction
    try {
      await FormAuditTrail.create(
        {
          bmr_id: bmr_id,
          changed_by: req.user.userId,
          previous_value: "Not Applicable",
          new_value: "Not Applicable",
          previous_status: "Under Approval",
          new_status: "Under Initiation",
          declaration: declaration,
          action: "Send from Approval to Open",
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

    // Commit the transaction
    await transaction.commit();

    // Fetch the initiator information
    const initiator = await getUserById(form.initiator);
    if (!initiator) {
      return res
        .status(404)
        .json({ error: true, message: "Initiator not found." });
    }

    // // Prepare mail data for the initiator
    // const date = new Date();
    // const dateOfInitiation = `${String(date.getDate()).padStart(
    //   2,
    //   "0"
    // )}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

    // const mailData = {
    //   bmrName: form.name,
    //   initiator: initiator.get("name"),
    //   dateOfInitiation: dateOfInitiation,
    //   status: "Under Initiation",
    //   initiatorName: initiator.get("name"),
    //   recipients: initiator.get("email"),
    // };

    // // Send email to the initiator asynchronously
    // Mailer.sendEmail("reminderInitiator", mailData).catch((emailError) => {
    //   console.error("Failed to send email to initiator:", emailError.message);
    // });

    return res.status(200).json({
      error: false,
      message: "BMR status successfully changed from approval to initiation",
    });
  } catch (error) {
    // Rollback the transaction only if it hasn't been committed yet
    if (!transaction.finished) {
      await transaction.rollback();
    }
    return res.status(500).json({
      error: true,
      message: `Error during changing stage of BMR: ${error.message}`,
    });
  }
};

exports.ApproveBMR = async (req, res) => {
  const { bmr_id, approvalComment, password, declaration } = req.body;

  // Validate required fields
  if (!password || !declaration) {
    return res
      .status(401)
      .json({ error: true, message: "Invalid email or password." });
  }

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    // Authenticate the user
    const user = await User.findOne({
      where: { user_id: req.user.userId, isActive: true },
      transaction,
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Retrieve the BMR form
    const form = await BMR.findOne({
      where: { bmr_id, isActive: true },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "BMR not found." });
    }

    if (form.stage !== 3) {
      // Ensure the BMR is at the correct stage for approval
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "BMR is not in a valid stage for approval.",
      });
    }

    // Check if the user is assigned as an approver and if they have already approved
    let alreadyApproved = false;
    const updatedApprovers = form.approvers.map((approver) => {
      if (approver.approverId === user.user_id) {
        if (approver.status === "approved") {
          alreadyApproved = true;
          return approver; // Return existing approver details if already approved
        } else {
          return { ...approver, status: "approved", comment: approvalComment }; // Update approval details
        }
      }
      return approver;
    });

    if (
      !updatedApprovers.some((approver) => approver.approverId === user.user_id)
    ) {
      await transaction.rollback();
      return res
        .status(403)
        .json({ error: true, message: "Not authorized to approve this BMR." });
    }

    if (alreadyApproved) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: true, message: "You have already approved this BMR." });
    }

    // Check if all approvers have completed their approval
    const allApproved = updatedApprovers.every(
      (approver) => approver.status === "approved"
    );

    // Update the BMR with new approvers' statuses and possibly update form status
    const updateData = {
      approvers: updatedApprovers,
      status: allApproved ? "Approved" : "Under Approval",
      stage: allApproved ? 4 : form.stage, // Assuming stage 4 is the final approval stage
    };

    await form.update(updateData, { transaction });

    // Log the audit trail synchronously to ensure consistency within the transaction
    await FormAuditTrail.create(
      {
        bmr_id: bmr_id,
        changed_by: req.user.userId,
        previous_value: "Not Applicable",
        new_value: "Not Applicable",
        previous_status: "Under Approval",
        new_status: allApproved ? "Approved" : "Under Approval",
        declaration: declaration,
        action: "Approve BMR form",
      },
      { transaction }
    );

    // Commit the transaction if all goes well
    await transaction.commit();
    res.status(200).json({
      error: false,
      message: "Approval completed successfully",
    });
  } catch (error) {
    // Rollback the transaction only if it hasn't been committed yet
    if (!transaction.finished) {
      await transaction.rollback();
    }
    res.status(500).json({
      error: true,
      message: `Error during approval: ${error.message}`,
    });
  }
};

exports.GetUserOnBasisOfRoleGroup = async (req, res) => {
  const { role_id } = req.body;

  try {
    const selectedUsers = await UserRole.findAll({
      where: {
        [Op.or]: [{ role_id: role_id }, { role_id: 6 }, { role_id: 1 }],
      },
      include: {
        model: User,
        where: {
          isActive: true,
        },
      },
    });

    // Send the response with the fetched users
    return res.status(200).json({
      error: false,
      message: selectedUsers,
    });
  } catch (error) {
    // Catch any errors and send an appropriate response
    console.error("Error fetching users:", error);
    return res.status(500).json({
      error: true,
      message: `Error fetching users: ${error.message}`,
    });
  }
};

exports.generateReport = async (req, res) => {
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
      res.render("bmr_form_report", { reportData }, (err, html) => {
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

    await browser.close();

    res.set("Content-Type", "application/pdf");
    res.send(pdf);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
};

exports.getBMRformAuditTrail = async (req, res) => {
  try {
    // Extract bmr_id from request parameters
    const BMRformId = req.params.id;

    // Check if bmr_id is provided
    if (!BMRformId) {
      return res
        .status(400)
        .json({ error: true, message: "BMR Form ID is required." });
    }

    // Find all audit trail entries for the given bmr_id
    const auditTrail = await FormAuditTrail.findAll({
      where: { bmr_id: BMRformId },
      include: {
        model: User,
        attributes: ["user_id", "name"],
      },
      order: [["auditTrail_id", "DESC"]],
    });

    if (!auditTrail || auditTrail.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No audit trail found for the given BMR form ID.",
      });
    }

    return res.status(200).json({ error: false, auditTrail });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: `Error retrieving audit trail: ${error.message}`,
    });
  }
};
