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

const getUserById = async (user_id) => {
  const user = await User.findOne({ where: { user_id, isActive: true } });
  return user;
};

exports.postBMR = async (req, res) => { 
  const { name, reviewers, approvers } = req.body;

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

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    // Check if BMR name already exists
    const existingBMR = await BMR.findOne({
      where: { name: name, isActive: true },
      transaction: transaction,
    });

    if (existingBMR) {
      await transaction.rollback(); // Roll back the transaction
      return res.status(409).json({
        error: true,
        message: "A BMR with the same name already exists.",
      });
    }

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
  let { bmr_id, tab_name } = req.body;

  // Check for missing fields
  if (!bmr_id || !tab_name) {
    return res.status(400).json({
      error: true,
      message: "Please provide proper details",
    });
  }

  try {
    // Check if a tab with the same name already exists for this BMR
    const existingTab = await BMR_Tab.findOne({
      where: {
        bmr_id: bmr_id,
        tab_name: tab_name,
        isActive: true,
      },
    });

    if (existingTab) {
      // If an existing tab is found, return an error response
      return res.status(409).json({
        error: true,
        message: "A tab with the same name already exists for this BMR.",
      });
    }

    // Create the new BMR tab if no conflicts are found
    await BMR_Tab.create({
      bmr_id: bmr_id,
      tab_name: tab_name,
    });

    return res.status(200).json({
      error: false,
      message: "BMR Tab created successfully!!",
    });
  } catch (e) {
    return res.status(500).json({
      error: true,
      message: `Error creating BMR Tab: ${e.message}`,
    });
  }
};

exports.postBMRSection = async (req, res) => {
  const { bmr_id, bmr_tab_id, section_name, limit } = req.body;

  // Validate provided details
  if (!bmr_id || !bmr_tab_id || !section_name || !limit) {
    return res.status(400).json({
      error: true,
      message: "Please provide proper details",
    });
  }

  try {
    // Check for existing section with the same name under the same BMR and tab
    const existingSection = await BMR_section.findOne({
      where: {
        bmr_id: bmr_id,
        bmr_tab_id: bmr_tab_id,
        section_name: section_name,
        isActive: true,
      },
    });

    if (existingSection) {
      // If a section already exists, return an error response
      return res.status(409).json({
        error: true,
        message:
          "A section with the same name already exists under the specified BMR and tab.",
      });
    }

    // Create the BMR section if no conflict is found
    await BMR_section.create({
      bmr_id: bmr_id,
      bmr_tab_id: bmr_tab_id,
      section_name: section_name,
      limit: limit,
    });

    // Send success response
    res.status(200).json({
      error: false,
      message: "BMR Section created successfully!!",
    });
  } catch (e) {
    // Handle errors
    if (!res.headersSent) {
      res.status(500).json({
        error: true,
        message: `Error creating BMR Section: ${e.message}`,
      });
    } else {
      console.error("Error in response handling:", e.message);
    }
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
  } = req.body;

  // Check for required fields
  if (
    !bmr_id ||
    !bmr_tab_id ||
    !bmr_section_id ||
    !label ||
    isRequired === undefined
  ) {
    return res.status(400).json({
      error: true,
      message: "Please provide proper details",
    });
  }

  try {
    // Check if a field with the same label already exists within the same section, tab, and BMR
    const existingField = await BMR_field.findOne({
      where: {
        bmr_id: bmr_id,
        bmr_tab_id: bmr_tab_id,
        bmr_section_id: bmr_section_id,
        label: label,
        isActive: true,
      },
    });

    if (existingField) {
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
        return res.status(400).json({
          error: true,
          message:
            "For 'single_select' or 'multi_select' types, acceptsMultiple must be an array of options.",
        });
      }
      // Optionally, validate the structure of each option here
      formattedAcceptsMultiple = JSON.stringify(acceptsMultiple);
    } else if (field_type === "grid") {
      // Ensure that acceptsMultiple contains grid column definitions
      if (
        typeof acceptsMultiple !== "object" ||
        !Array.isArray(acceptsMultiple.columns)
      ) {
        return res.status(400).json({
          error: true,
          message:
            "For 'grid' type, acceptsMultiple must contain an object with a 'columns' array.",
        });
      }
      // Optionally, validate each column's structure here
      formattedAcceptsMultiple = JSON.stringify(acceptsMultiple);
    }

    // Create the BMR field if no conflict is found
    await BMR_field.create({
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
    });

    // Send success response
    res.status(200).json({
      error: false,
      message: "BMR Field created successfully!!",
    });
  } catch (e) {
    // Handle errors
    if (!res.headersSent) {
      res.status(500).json({
        error: true,
        message: `Error creating BMR Field: ${e.message}`,
      });
    } else {
      console.error("Error in response handling:", e.message);
    }
  }
};

exports.editBMR = async (req, res) => {
  const bmr_id = req.params.id;
  const { name, reviewers, approvers } = req.body;

  if (!bmr_id) {
    return res.status(400).json({
      error: true,
      message: "Please provide proper BMR details",
    });
  }

  try {
    // Check if a different BMR with the same name already exists
    const existingBMR = await BMR.findOne({
      where: {
        name: name,
        bmr_id: { [Op.ne]: bmr_id }, // Exclude the current BMR from the check
        isActive: true,
      },
    });

    if (existingBMR) {
      return res.status(409).json({
        error: true,
        message: "A BMR with the same name already exists.",
      });
    }

    // Proceed with the update if no duplicate name is found
    await BMR.update(
      {
        name: name,
        reviewers: reviewers,
        approvers: approvers,
      },
      { where: { bmr_id: bmr_id } }
    );

    // Check if the update was successful
    const updatedBMR = await BMR.findOne({
      where: { bmr_id: bmr_id },
    });

    if (!updatedBMR) {
      return res.status(404).json({
        error: true,
        message: "BMR not found.",
      });
    }

    res.status(200).json({
      error: false,
      message: "BMR updated successfully!!",
    });
  } catch (e) {
    if (!res.headersSent) {
      res.status(500).json({
        error: true,
        message: `Error updating BMR: ${e.message}`,
      });
    } else {
      console.error("Error in response handling:", e.message);
    }
  }
};

exports.editBMRTab = async (req, res) => {
  const bmr_tab_id = req.params.id;
  const { bmr_id, tab_name } = req.body;

  if (!bmr_id || !tab_name) {
    return res.status(400).json({
      error: true,
      message: "Please provide proper details",
    });
  }

  try {
    // Check if a different tab with the same name already exists under the same BMR
    const existingTab = await BMR_Tab.findOne({
      where: {
        bmr_id: bmr_id,
        tab_name: tab_name,
        bmr_tab_id: { [Op.ne]: bmr_tab_id }, // Exclude the current tab from the check
        isActive: true,
      },
    });

    if (existingTab) {
      return res.status(409).json({
        error: true,
        message: "A tab with the same name already exists for this BMR.",
      });
    }

    // Proceed with the update if no duplicate tab name is found
    const [updated] = await BMR_Tab.update(
      { tab_name: tab_name },
      { where: { bmr_tab_id: bmr_tab_id } }
    );

    if (updated === 0) {
      return res.status(404).json({
        error: true,
        message: "BMR Tab not found.",
      });
    }

    res.status(200).json({
      error: false,
      message: "BMR Tab updated successfully!!",
    });
  } catch (e) {
    if (!res.headersSent) {
      res.status(500).json({
        error: true,
        message: `Error updating BMR Tab: ${e.message}`,
      });
    } else {
      console.error("Error in response handling:", e.message);
    }
  }
};

exports.editBMRSection = async (req, res) => {
  const bmr_section_id = req.params.id;
  const { bmr_id, section_name, bmr_tab_id, limit } = req.body;

  if (!bmr_id || !section_name || !bmr_tab_id) {
    return res.status(400).json({
      error: true,
      message: "Please provide proper details",
    });
  }

  try {
    // Check if a different section with the same name already exists under the same BMR and tab
    const existingSection = await BMR_section.findOne({
      where: {
        bmr_id: bmr_id,
        bmr_tab_id: bmr_tab_id,
        section_name: section_name,
        bmr_section_id: { [Op.ne]: bmr_section_id }, // Exclude the current section from the check
        isActive: true,
      },
    });

    if (existingSection) {
      return res.status(409).json({
        error: true,
        message:
          "A section with the same name already exists under the specified BMR and tab.",
      });
    }

    // Proceed with the update if no duplicate section name is found
    const updated = await BMR_section.update(
      {
        bmr_id: bmr_id,
        bmr_tab_id: bmr_tab_id,
        section_name: section_name,
        limit: limit,
      },
      { where: { bmr_section_id: bmr_section_id } }
    );

    // Ensure that update was successful
    if (updated[0] === 0) {
      return res.status(404).json({
        error: true,
        message: "BMR Section not found.",
      });
    }

    res.status(200).json({
      error: false,
      message: "BMR Section updated successfully!!",
    });
  } catch (e) {
    res.status(500).json({
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
  } = req.body;

  if (
    !bmr_id ||
    !bmr_tab_id ||
    !bmr_section_id ||
    !label ||
    isRequired === undefined
  ) {
    return res.status(400).json({
      error: true,
      message: "Please provide proper details",
    });
  }

  try {
    const existingField = await BMR_field.findOne({
      where: {
        bmr_id: bmr_id,
        bmr_tab_id: bmr_tab_id,
        bmr_section_id: bmr_section_id,
        label: label,
        bmr_field_id: { [Op.ne]: bmr_field_id }, // Exclude the current field from the check
        isActive: true,
      },
    });

    if (existingField) {
      return res.status(409).json({
        error: true,
        message: "A field with the same label already exists in this section.",
      });
    }

    let formattedAcceptsMultiple = acceptsMultiple;

    // Formatting acceptsMultiple based on field_type
    if (field_type === "single_select" || field_type === "multi_select") {
      if (!Array.isArray(acceptsMultiple)) {
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
        return res.status(400).json({
          error: true,
          message:
            "For 'grid' type, acceptsMultiple must contain an object with a 'columns' array.",
        });
      }
      formattedAcceptsMultiple = JSON.stringify(acceptsMultiple);
    }

    // Proceed with the update
    const [updated] = await BMR_field.update(
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
      { where: { bmr_field_id: bmr_field_id } }
    );

    if (updated === 0) {
      return res.status(404).json({
        error: true,
        message: "BMR Field not found.",
      });
    }

    res.status(200).json({
      error: false,
      message: "BMR Field updated successfully!!",
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Error updating BMR Field: ${e.message}`,
    });
  }
};

exports.deleteBMR = async (req, res) => {
  try {
    const bmrId = req.params.id;

    // Check if the BMR exists and is active
    const Bmr = await BMR.findOne({
      where: { bmr_id: bmrId, isActive: true },
    });

    if (!Bmr) {
      return res.status(404).json({
        error: true,
        message: "BMR not found",
      });
    }

    // Mark the BMR as inactive
    const [updated] = await BMR.update(
      { isActive: false },
      {
        where: {
          bmr_id: bmrId,
        },
      }
    );

    // Ensure that update was successful
    if (updated === 0) {
      return res.status(404).json({
        error: true,
        message: "Failed to delete BMR, please try again.",
      });
    }

    res.json({
      error: false,
      message: "BMR deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: `Error deleting BMR: ${err.message}`,
    });
  }
};

exports.deleteBMRTab = async (req, res) => {
  try {
    const bmrTabId = req.params.id;

    // Check if the BMR Tab exists and is active
    const tab = await BMR_Tab.findOne({
      where: { bmr_tab_id: bmrTabId, isActive: true },
    });

    if (!tab) {
      return res.status(404).json({
        error: true,
        message: "BMR Tab not found",
      });
    }

    // Mark the BMR Tab as inactive
    const [updated] = await BMR_Tab.update(
      { isActive: false },
      {
        where: {
          bmr_tab_id: bmrTabId,
        },
      }
    );

    // Ensure that update was successful
    if (updated === 0) {
      return res.status(404).json({
        error: true,
        message: "Failed to delete BMR Tab, please try again.",
      });
    }

    res.json({
      error: false,
      message: "BMR Tab deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: `Error deleting BMR Tab: ${err.message}`,
    });
  }
};

exports.deleteBMRSection = async (req, res) => {
  const bmrSectionId = req.params.id;

  try {
    // Check if the BMR Section exists and is active
    const section = await BMR_section.findOne({
      where: { bmr_section_id: bmrSectionId, isActive: true },
    });

    if (!section) {
      return res.status(404).json({
        error: true,
        message: "BMR Section not found",
      });
    }

    // Mark the BMR Section as inactive
    const [updated] = await BMR_section.update(
      { isActive: false },
      {
        where: {
          bmr_section_id: bmrSectionId,
        },
      }
    );

    // Ensure that the update was successful
    if (updated === 0) {
      return res.status(400).json({
        error: true,
        message: "Failed to delete BMR Section, please try again.",
      });
    }

    res.status(200).json({
      error: false,
      message: "BMR Section deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: `Error deleting BMR Section: ${err.message}`,
    });
  }
};

exports.deleteBMRField = async (req, res) => {
  const bmrFieldId = req.params.id;

  try {
    // Check if the BMR Field exists and is active
    const field = await BMR_field.findOne({
      where: { bmr_field_id: bmrFieldId, isActive: true },
    });

    if (!field) {
      return res.status(404).json({
        error: true,
        message: "BMR Field not found",
      });
    }

    // Mark the BMR Field as inactive
    const [updated] = await BMR_field.update(
      { isActive: false },
      {
        where: {
          bmr_field_id: bmrFieldId,
        },
      }
    );

    // Ensure that the update was successful
    if (updated === 0) {
      return res.status(400).json({
        error: true,
        message: "Failed to delete BMR Field, please try again.",
      });
    }

    res.status(200).json({
      error: false,
      message: "BMR Field deleted successfully",
    });
  } catch (err) {
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

exports.SendBMRForReview = async (req, res) => {
  const { bmr_id, email, password, initiatorComment } = req.body;

  // Check for required fields and provide specific error messages
  if (!bmr_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a bmr ID." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Verify user credentials
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

    // Find the form
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

    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const dateOfInitiation = `${day}-${month}-${year}`;

    const emailPromises = form?.reviewers.map(async (person) => {
      const userData = await getUserById(person.reviewerId);
      const initiatorData = await getUserById(form.initiator);

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

    res.status(200).json({
      error: false,
      message: "BMR successfully sent for review",
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error during sending Process for review: ${error.message}`,
    });
  }
};

exports.SendBMRfromReviewToOpen = async (req, res) => {
  const { bmr_id, email, password } = req.body;

  // Check for required fields and provide specific error messages
  if (!bmr_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Verify user credentials
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

    // Find the form
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
        message: "BMR is not in a valid stage.",
      });
    }

    const updatedReviewers = form.reviewers.map((reviewer) => ({
      ...reviewer,
      status: "pending", // Change the status to pending
      comment: null, // Optionally reset the comment
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

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "BMR status successfully changed from review to initiation",
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error during changing stage of BMR: ${error.message}`,
    });
  }
};

exports.SendBMRReviewToApproval = async (req, res) => {
  const { bmr_id, reviewComment, password } = req.body;

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Authenticate the user
    const user = await User.findOne({
      where: { user_id: req.user.userId, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "User not found." });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid password." });
    }

    // Retrieve the form
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
          return reviewer; // Return existing reviewer details if already reviewed
        } else {
          return { ...reviewer, status: "reviewed", comment: reviewComment }; // Update review details
        }
      }
      return reviewer;
    });

    // Check if user was found in the reviewers list and if they have already reviewed
    if (
      !updatedReviewers.some((reviewer) => reviewer.reviewerId === user.user_id)
    ) {
      await transaction.rollback();
      return res
        .status(403)
        .json({ error: true, message: "Not authorized to review this form." });
    }
    if (alreadyReviewed) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: true, message: "You have already reviewed this form." });
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
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const dateOfInitiation = `${day}-${month}-${year}`;

      // If all reviewers have reviewed, send emails to approvers
      const emailPromises = form.approvers.map(async (approver) => {
        const approverData = await getUserById(approver.approverId);
        const initiatorData = await getUserById(form.initiator);
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

    await form.update(updateData, { transaction });

    await transaction.commit();
    res.status(200).json({
      error: false,
      message: "Review completed successfully",
    });
  } catch (error) {
    // Rollback the transaction in case of any error
    await transaction.rollback();
    res.status(500).json({
      error: true,
      message: `Error during review: ${error.message}`,
    });
  }
};

exports.SendBMRfromApprovalToOpen = async (req, res) => {
  const { bmr_id, email, password } = req.body;

  // Check for required fields and provide specific error messages
  if (!bmr_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Verify user credentials
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

    // Find the form
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
        message: "BMR is not in a valid stage.",
      });
    }

    // Update the reviewers and approvers arrays in JavaScript
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

    // Update the form with the new reviewers and approvers array
    await form.update(
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

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "BMR status successfully changed from review to initiation",
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error during changing stage of BMR: ${error.message}`,
    });
  }
};

exports.ApproveBMR = async (req, res) => {
  const { bmr_id, approvalComment, password } = req.body;

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Authenticate the user
    const user = await User.findOne({
      where: { user_id: req.user.userId, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "User not found." });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid password." });
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
        message: "BMR is not in a valid stage to be sent for approval.",
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

    // Check if user was found in the approvers list and if they have already approved
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
    };

    if (allApproved) {
      updateData.status = "Approved";
      updateData.stage = 4; // Assuming stage 4 is the final approval stage
    }

    await form.update(updateData, { transaction });

    // Commit the transaction if all goes well
    await transaction.commit();
    res.status(200).json({
      error: false,
      message: "Approval completed successfully",
    });
  } catch (error) {
    // Rollback the transaction in case of any error
    await transaction.rollback();
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
