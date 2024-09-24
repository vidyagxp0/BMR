const { sequelize } = require("../config/db");
const PrintControl = require("../models/print_control.model");
const { Op } = require("sequelize");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { canUserPrint } = require("../middlewares/print_control");
const PrintControlAuditTrail = require("../models/print_control_audit_trail.model");

// Create Print Control
exports.createPrintControl = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      role_id,
      user_id,
      initiator,
      reviewers,
      approvers,
      daily,
      weekly,
      monthly,
      yearly,
    } = req.body;

    // Check if a print control already exists for the role or user
    const existingControl = await PrintControl.findOne({
      where: {
        [Op.or]: [{ role_id }, { user_id }],
        isActive: true,
      },
    });

    if (existingControl) {
      return res.status(400).json({
        error: true,
        message: "Print control already exists for this user or role.",
      });
    }

    let newPC = await PrintControl.create(
      {
        role_id,
        user_id,
        initiator,
        reviewers: JSON.stringify(reviewers),
        approvers: JSON.stringify(approvers),
        stage: 1,
        status: "Under Initiation",
        daily,
        weekly,
        monthly,
        yearly,
      },
      { transaction: t }
    );

    // Fields to be logged in the audit trail
    const fieldsToLog = [
      "role_id",
      "user_id",
      "initiator",
      "daily",
      "weekly",
      "monthly",
      "yearly",
    ];
    for (let field of fieldsToLog) {
      let fieldValue = req.body[field];
      if (fieldValue !== undefined) {
        await PrintControlAuditTrail.create(
          {
            print_control_id: newPC.print_control_id,
            changed_by: req.user.userId,
            field_name: field,
            previous_value: "Not Applicable",
            new_value: fieldValue,
            previous_status: "None",
            new_status: "Under Initiation",
            action: "Creation",
          },
          { transaction: t }
        );
      }
    }

    // Function to log reviewers and approvers
    const logReviewersAndApprovers = async (arr, type) => {
      for (const item of arr) {
        await PrintControlAuditTrail.create(
          {
            print_control_id: newPC.print_control_id,
            changed_by: req.user.userId,
            field_name: `${type} details`,
            previous_value: "Not Applicable",
            new_value: JSON.stringify(item),
            previous_status: "None",
            new_status: "Under Initiation",
            action: "Creation",
          },
          { transaction: t }
        );
      }
    };

    if (reviewers && reviewers.length > 0) {
      await logReviewersAndApprovers(reviewers, "Reviewer");
    }

    if (approvers && approvers.length > 0) {
      await logReviewersAndApprovers(approvers, "Approver");
    }

    await t.commit();
    return res.status(201).json({
      error: false,
      message: "Print Control added successfully.",
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      error: true,
      message:
        "An error occurred while creating print control: " + error.message,
    });
  }
};

// Get Print Controls
exports.getPrintControls = async (req, res) => {
  try {
    const printControls = await PrintControl.findAll({
      where: {
        isActive: true,
      },
    });
    return res.status(200).json({
      error: false,
      message: printControls,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "An error occurred while fetching print controls." + error,
    });
  }
};

// Update Print Control
exports.updatePrintControl = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const updates = req.body;

    const printControl = await PrintControl.findOne({
      where: {
        print_control_id: id,
        isActive: true,
      },
    });

    if (!printControl) {
      return res
        .status(404)
        .json({ error: true, message: "Print control not found." });
    }

    // Store the old values for comparison
    const oldValues = printControl.toJSON();
    const oldReviewers = JSON.parse(oldValues.reviewers || "[]");
    const oldApprovers = JSON.parse(oldValues.approvers || "[]");

    // Update the print control with the new values
    await printControl.update(updates, { transaction: t });

    // Function to log changes in the audit trail
    const logChange = async (field, oldValue, newValue) => {
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        await PrintControlAuditTrail.create(
          {
            print_control_id: id,
            changed_by: req.user.userId,
            field_name: field,
            previous_value: JSON.stringify(oldValue),
            new_value: JSON.stringify(newValue),
            previous_status: oldValues.status, // assuming 'status' is part of the printControl
            new_status: updates.status || oldValues.status,
            action: "Update",
          },
          { transaction: t }
        );
      }
    };

    // Check for changes in simple fields
    for (const key in updates) {
      if (
        updates.hasOwnProperty(key) &&
        !["reviewers", "approvers"].includes(key)
      ) {
        await logChange(key, oldValues[key], updates[key]);
      }
    }

    // Special handling for reviewers and approvers if they're included in updates
    if ("reviewers" in updates) {
      await logChange("reviewers", oldReviewers, updates.reviewers);
    }
    if ("approvers" in updates) {
      await logChange("approvers", oldApprovers, updates.approvers);
    }

    await t.commit();
    return res.status(200).json({
      error: false,
      message: "Print Control updated successfully!!",
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      error: true,
      message:
        "An error occurred while updating print control: " + error.message,
    });
  }
};

// Delete Print Control
exports.deletePrintControl = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const printControl = await PrintControl.findOne({
      where: {
        print_control_id: id,
        isActive: true,
      },
    });

    if (!printControl) {
      return res
        .status(404)
        .json({ error: true, message: "Print control not found." });
    }

    await printControl.update({ isActive: false }, { transaction: t });
    await PrintControlAuditTrail.create(
      {
        print_control_id: id,
        changed_by: req.user.userId,
        field_name: 'Not Applicable',
        previous_value: 'Not Applicable',
        new_value: 'Not Applicable',
        previous_status: oldValues.status, // assuming 'status' is part of the printControl
        new_status: updates.status || oldValues.status,
        action: "Delete",
      },
      { transaction: t }
    );
    await t.commit();
    return res
      .status(200)
      .json({ message: "Print control deleted successfully." });
  } catch (error) {
    await t.rollback();
    return res
      .status(500)
      .json({ error: "An error occurred while deleting print control." });
  }
};

exports.CheckUserPrintLimit = async (req, res) => {
  try {
    const { canPrint, remaining } = await canUserPrint(req.user.userId);
    res.status(200).json({ canPrint, remaining });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.SendPrintControlForReview = async (req, res) => {
  const {
    print_control_id,
    email,
    password,
    initiatorComment,
    declaration,
    comments,
  } = req.body;

  // Validate required fields
  if (!print_control_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a Print Control ID." });
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
    const Printcontrol = await PrintControl.findOne({
      where: { print_control_id, isActive: true },
      transaction,
    });

    if (!Printcontrol) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ error: true, message: "Print Control not found." });
    }

    if (Printcontrol.stage !== 1) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Print Control is not in a valid stage to be sent for review.",
      });
    }

    // Update the form details
    await Printcontrol.update(
      {
        status: "Under Review",
        stage: 2,
        initiatorComment: initiatorComment,
      },
      { transaction }
    );

    await PrintControlAuditTrail.create(
      {
        print_control_id: print_control_id,
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

    await transaction.commit(); // Commit the transaction

    // // Send review emails asynchronously
    // const emailPromises = Printcontrol.reviewers.map(async (person) => {
    //   const userData = await getUserById(person.reviewerId);
    //   const initiatorData = await getUserById(form.initiator);

    //   const mailData = {
    //     bmrName: form.name,
    //     user_id: person.reviewerId,
    //     initiator: initiatorData.name,
    //     dateOfInitiation: new Date().toISOString().split("T")[0],
    //     status: "Under Review",
    //     recipients: userData.email,
    //     reviewerName: userData.name,
    //   };

    //   try {
    //     await Mailer.sendEmail("reminderReviewer", mailData);
    //   } catch (emailError) {
    //     console.error("Failed to send email to reviewer:", emailError.message);
    //   }
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

exports.SendPrintControlfromReviewToOpen = async (req, res) => {
  const { print_control_id, email, password, declaration, comments } = req.body;

  // Validate required fields
  if (!print_control_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a Print control ID." });
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
    const Printcontrol = await PrintControl.findOne({
      where: { print_control_id, isActive: true },
      transaction,
    });

    if (!Printcontrol) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "BMR not found." });
    }

    if (Printcontrol.stage !== 2) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message:
          "Print Control is not in a valid stage to be sent from review to open.",
      });
    }

    // Update reviewers' status and reset comments
    const updatedReviewers = Printcontrol.reviewers.map((reviewer) => ({
      ...reviewer,
      status: "pending",
      comment: null,
      date_of_review: "NA",
    }));

    // Update the form details
    await Printcontrol.update(
      {
        status: "Under Initiation",
        stage: 1,
        reviewers: updatedReviewers,
      },
      { transaction }
    );

    // Log the audit trail synchronously to ensure consistency within the transaction
    await PrintControlAuditTrail.create(
      {
        print_control_id: print_control_id,
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

    // Commit the transaction
    await transaction.commit();

    // // Prepare mail data for the initiator
    // const initiator = await getUserById(form.initiator);
    // if (!initiator) {
    //   return res
    //     .status(404)
    //     .json({ error: true, message: "Initiator not found." });
    // }

    // const date = new Date();
    // const dateOfInitiation = `${String(date.getDate()).padStart(
    //   2,
    //   "0"
    // )}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

    // const mailData = {
    //   bmrName: form.name,
    //   user_id: form.initiator,
    //   initiator: initiator.get("name"),
    //   dateOfInitiation: dateOfInitiation,
    //   status: "Under Initiation",
    //   initiatorName: initiator.get("name"),
    //   recipients: initiator.get("email"),
    // };

    // // Send email to the initiator asynchronously
    // const emailPromise =
    //   Mailer.sendEmail("reminderInitiator", mailData) || Promise.resolve();
    // emailPromise.catch((emailError) => {
    //   console.error("Failed to send email to initiator:", emailError.message);
    // });

    return res.status(200).json({
      error: false,
      message: "BMR status successfully changed from review to initiation",
    });
  } catch (error) {
    console.error("Error during BMR operation:", error.message);
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    return res.status(500).json({
      error: true,
      message: `Error during changing stage of BMR: ${error.message}`,
    });
  }
};

exports.SendPrintControlReviewToApproval = async (req, res) => {
  const { print_control_id, reviewComment, password, declaration, comments } =
    req.body;

  if (!password || !declaration) {
    return res
      .status(401)
      .json({ error: true, message: "Invalid email or password." });
  }

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
        .json({ error: true, message: "Invalid email or password." });
    }

    const Printcontrol = await PrintControl.findOne({
      where: { print_control_id, isActive: true },
      transaction,
    });

    if (!Printcontrol) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ error: true, message: "Print control not found." });
    }

    if (Printcontrol.stage !== 2) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message:
          "Print control is not in a valid stage to be sent for approval.",
      });
    }

    let alreadyReviewed = false;
    const updatedReviewers = Printcontrol.reviewers.map((reviewer) => {
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
      await Printcontrol.update(updateData, { transaction });

      // Log the audit trail synchronously to ensure consistency within the transaction
      await PrintControlAuditTrail.create(
        {
          print_control_id: print_control_id,
          changed_by: req.user.userId,
          field_name: "Stage Change",
          previous_value: "Not Applicable",
          new_value: "Not Applicable",
          previous_status: "Under Review",
          new_status: "Under Approval",
          declaration: declaration,
          comments: comments,
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
      //     user_id: form.initiator,
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
      await Printcontrol.update(updateData, { transaction });

      // Log the audit trail synchronously to ensure consistency within the transaction
      await PrintControlAuditTrail.create(
        {
          print_control_id: print_control_id,
          changed_by: req.user.userId,
          field_name: "Stage Change",
          previous_value: "Not Applicable",
          new_value: "Not Applicable",
          previous_status: "Under Review",
          new_status: "Under Review",
          declaration: declaration,
          comments: comments,
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

exports.SendPrintControlfromApprovalToOpen = async (req, res) => {
  const { print_control_id, email, password, declaration, comments } = req.body;

  // Validate required fields
  if (!print_control_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a Print control ID." });
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
    const Printcontrol = await PrintControl.findOne({
      where: { print_control_id, isActive: true },
      transaction,
    });

    if (!Printcontrol) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ error: true, message: "Print control not found." });
    }

    if (Printcontrol.stage !== 3) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message:
          "Print control is not in a valid stage to be moved from approval to initiation.",
      });
    }

    // Reset reviewers and approvers to pending status
    const updatedReviewers = Printcontrol.reviewers.map((reviewer) => ({
      ...reviewer,
      status: "pending",
      comment: null, // Optionally reset the comment
      date_of_approval: "NA",
    }));

    const updatedApprovers = Printcontrol.approvers.map((approver) => ({
      ...approver,
      status: "pending",
      comment: null, // Optionally reset the comment
    }));

    // Update the form status and stages
    await Printcontrol.update(
      {
        status: "Under Initiation",
        stage: 1,
        reviewers: updatedReviewers,
        approvers: updatedApprovers,
      },
      { transaction }
    );

    // Log the audit trail synchronously to ensure consistency within the transaction
    await PrintControlAuditTrail.create(
      {
        print_control_id: print_control_id,
        changed_by: req.user.userId,
        field_name: "Stage Change",
        previous_value: "Not Applicable",
        new_value: "Not Applicable",
        previous_status: "Under Approval",
        new_status: "Under Initiation",
        declaration: declaration,
        comments: comments,
        action: "Send from Approval to Open",
      },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

    // Fetch the initiator information
    // const initiator = await getUserById(Printcontrol.initiator);
    // if (!initiator) {
    //   return res
    //     .status(404)
    //     .json({ error: true, message: "Initiator not found." });
    // }

    // // Prepare mail data for the initiator
    // const date = new Date();
    // const dateOfInitiation = `${String(date.getDate()).padStart(
    //   2,
    //   "0"
    // )}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

    // const mailData = {
    //   bmrName: form.name,
    //   user_id: form.initiator,
    //   initiator: initiator.get("name"),
    //   dateOfInitiation: dateOfInitiation,
    //   status: "Under Initiation",
    //   initiatorName: initiator.get("name"),
    //   recipients: initiator.get("email"),
    // };

    // // Send email to the initiator asynchronously
    // const emailPromise =
    //   Mailer.sendEmail("reminderInitiator", mailData) || Promise.resolve();
    // emailPromise.catch((emailError) => {
    //   console.error("Failed to send email to initiator:", emailError.message);
    // });

    return res.status(200).json({
      error: false,
      message: "BMR status successfully changed from approval to initiation",
    });
  } catch (error) {
    console.error("Error during BMR operation:", error.message);
    if (!transaction.finished) {
      await transaction.rollback();
    }
    return res.status(500).json({
      error: true,
      message: `Error during changing stage of BMR: ${error.message}`,
    });
  }
};

exports.ApprovePrintControl = async (req, res) => {
  const { print_control_id, approvalComment, password, declaration, comments } =
    req.body;

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

    if (!user || !(await bcrypt.compare(password, user.password))) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    const Printcontrol = await PrintControl.findOne({
      where: { print_control_id, isActive: true },
      transaction,
    });

    if (!Printcontrol) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ error: true, message: "Print control not found." });
    }

    if (Printcontrol.stage !== 3) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Print control is not in a valid stage for approval.",
      });
    }

    let alreadyApproved = false;
    const updatedApprovers = Printcontrol.approvers.map((approver) => {
      if (approver.approverId === user.user_id) {
        if (approver.status === "approved") {
          alreadyApproved = true;
          return approver; // Return existing approver details if already approved
        } else {
          return {
            ...approver,
            status: "approved",
            comment: approvalComment,
            date_of_approval: new Date(),
          }; // Update approval details
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

    const allApproved = updatedApprovers.every(
      (approver) => approver.status === "approved"
    );

    // Update the BMR with new approvers' statuses and possibly update form status
    const updateData = {
      approvers: updatedApprovers,
      status: allApproved ? "Approved" : "Under Approval",
      stage: allApproved ? 4 : Printcontrol.stage, // Assuming stage 4 is the final approval stage
    };

    await Printcontrol.update(updateData, { transaction });

    // Log the audit trail synchronously to ensure consistency within the transaction
    await PrintControlAuditTrail.create(
      {
        print_control_id: print_control_id,
        changed_by: req.user.userId,
        field_name: "Stage Change",
        previous_value: "Not Applicable",
        new_value: "Not Applicable",
        previous_status: "Under Approval",
        new_status: allApproved ? "Approved" : "Under Approval",
        declaration: declaration,
        comments: comments,
        action: "Approve BMR form",
      },
      { transaction }
    );

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
