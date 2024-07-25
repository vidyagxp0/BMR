const BMR = require("../models/bmr.model");
const BMR_field = require("../models/bmr_fields.model");
const BMR_Tab = require("../models/bmr_tabs.model");
const UserRole = require("../models/userRole.model");
const { sequelize } = require("../config/db");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

exports.postBMR = (req, res) => {
  let { name, reviewers, approvers } = req.body;

  if (!name) {
    return res.status(400).json({
      error: true,
      message: "Please Provide a proper BMR details",
    });
  }

  BMR.create({
    name: name,
    reviewers: reviewers,
    approvers: approvers,
    initiator: req.user.userId,
    stage: 1,
    status: "Under Initiation",
  })
    .then(() => {
      res.status(200).json({
        error: false,
        message: "BMR created successfully!!",
      });
    })
    .catch((e) => {
      res.status(400).json({
        error: true,
        message: `Error creating BMR: ${e}`,
      });
    });
};

exports.postBMRTab = (req, res) => {
  let { bmr_id, tab_name } = req.body;

  console.log(bmr_id, tab_name);

  if (!bmr_id || !tab_name) {
    return res.status(400).json({
      error: true,
      message: "Please Provide proper details",
    });
  }

  BMR_Tab.create({
    bmr_id: bmr_id,
    tab_name: tab_name,
  })
    .then(() => {
      res.status(200).json({
        error: false,
        message: "BMR Tab created successfully!!",
      });
    })
    .catch((e) => {
      res.status(400).json({
        error: true,
        message: `Error creating BMR Tab: ${e}`,
      });
    });
};

exports.postBMRField = (req, res) => {
  let {
    bmr_id,
    bmr_tab_id,
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

  if (!bmr_id || !bmr_tab_id || !label || !isRequired) {
    return res.status(400).json({
      error: true,
      message: "Please Provide a proper details",
    });
  }

  BMR_field.create({
    bmr_id: bmr_id,
    bmr_tab_id: bmr_tab_id,
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
    acceptsMultiple: acceptsMultiple,
  })
    .then(() => {
      res.status(200).json({
        error: false,
        message: "BMR Field created successfully!!",
      });
    })
    .catch((e) => {
      res.status(400).json({
        error: true,
        message: `Error creating BMR Field: ${e}`,
      });
    });
};

exports.editBMR = (req, res) => {
  const { bmr_id } = req.params;
  const { name, reviewer, approver, initiatorComment } = req.body;

  if (!name) {
    return res.status(400).json({
      error: true,
      message: "Please provide a proper BMR name",
    });
  }

  BMR.update(
    {
      name: name,
      reviewer: reviewer,
      approver: approver,
      initiatorComment: initiatorComment,
    },
    { where: { bmr_id: bmr_id } }
  )
    .then(() => {
      res.status(200).json({
        error: false,
        message: "BMR updated successfully!!",
      });
    })
    .catch((e) => {
      res.status(400).json({
        error: true,
        message: `Error updating BMR: ${e}`,
      });
    });
};

exports.editBMRTab = (req, res) => {
  const { tab_id } = req.params;
  const { bmr_id, tab_name } = req.body;

  if (!bmr_id || !tab_name) {
    return res.status(400).json({
      error: true,
      message: "Please provide proper details",
    });
  }

  BMR_Tab.update(
    { bmr_id: bmr_id, tab_name: tab_name },
    { where: { tab_id: tab_id } }
  )
    .then(() => {
      res.status(200).json({
        error: false,
        message: "BMR Tab updated successfully!!",
      });
    })
    .catch((e) => {
      res.status(400).json({
        error: true,
        message: `Error updating BMR Tab: ${e}`,
      });
    });
};

exports.editBMRField = (req, res) => {
  const { field_id } = req.params;
  const {
    bmr_id,
    bmr_tab_id,
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

  if (!bmr_id || !bmr_tab_id || !label || !isRequired) {
    return res.status(400).json({
      error: true,
      message: "Please provide proper details",
    });
  }

  BMR_field.update(
    {
      bmr_id: bmr_id,
      bmr_tab_id: bmr_tab_id,
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
      acceptsMultiple: acceptsMultiple,
    },
    { where: { field_id: field_id } }
  )
    .then(() => {
      res.status(200).json({
        error: false,
        message: "BMR Field updated successfully!!",
      });
    })
    .catch((e) => {
      res.status(400).json({
        error: true,
        message: `Error updating BMR Field: ${e}`,
      });
    });
};

exports.deleteBMR = async (req, res) => {
  try {
    const Bmr = await BMR.findOne({ where: { bmr_id: req.params.id } });
    if (!Bmr) {
      return res.status(404).json({
        error: true,
        message: "BMR not found",
      });
    }

    await BMR.update(
      { isActive: false },
      {
        where: {
          bmr_id: req.params.id,
        },
      }
    );

    res.json({
      error: false,
      message: "BMR deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};

exports.deleteBMRTab = async (req, res) => {
  try {
    const Tab = await BMR_Tab.findOne({ where: { tab_id: req.params.id } });
    if (!Tab) {
      return res.status(404).json({
        error: true,
        message: "BMR Tab not found",
      });
    }

    await BMR_Tab.update(
      { isActive: false },
      {
        where: {
          tab_id: req.params.id,
        },
      }
    );

    res.json({
      error: false,
      message: "BMR Tab deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};

exports.deleteBMRField = async (req, res) => {
  try {
    const Field = await BMR_field.findOne({
      where: { field_id: req.params.id },
    });
    if (!Field) {
      return res.status(404).json({
        error: true,
        message: "BMR Field not found",
      });
    }

    await BMR_field.update(
      { isActive: false },
      {
        where: {
          field_id: req.params.id,
        },
      }
    );

    res.json({
      error: false,
      message: "BMR Field deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
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
      },
      {
        model: BMR_field,
        where: { isActive: true },
        required: false,
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
      where: { bmr_id },
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
    await transaction.commit();
    return res.status(200).json({
      error: false,
      message: "Process successfully sent for review",
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
      where: { bmr_id },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "Elog not found." });
    }

    if (form.stage !== 2) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "BMR is not in a valid stage.",
      });
    }

    // Update the form details
    await form.update(
      {
        status: "Under Initiation",
        stage: 1,
      },
      { transaction }
    );

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
  const { bmr_id, reviewComment, email, password } = req.body;

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Authenticate the user
    const user = await User.findOne({
      where: { email, isActive: true },
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
      where: { bmr_id },
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
    }

    await form.update(updateData, { transaction });

    // Commit the transaction if all goes well
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
      where: { bmr_id },
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

    // Update the form details
    await form.update(
      {
        status: " Under Initiation",
        stage: 1,
      },
      { transaction }
    );

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
  const { bmr_id, approvalComment, email, password } = req.body;

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Authenticate the user
    const user = await User.findOne({
      where: { email, isActive: true },
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
      where: { bmr_id },
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
