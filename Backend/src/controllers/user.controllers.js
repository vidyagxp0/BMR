const User = require("../models/user.model");
const UserRole = require("../models/userRole.model");
const Role = require("../models/role.model");
const config = require("../config/config.json");
const bcrypt = require("bcrypt");
const { sequelize } = require("../config/db");
const jwt = require("jsonwebtoken");
const { getFileUrl } = require("../middlewares/authentication");

exports.Adminlogin = async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password presence
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid Credentials" });
  }

  // Find user by email using prepared statement approach (assuming a library like Sequelize)
  User.findOne({ where: { email: email.toLowerCase(), isActive: true } })
    .then(async (data) => {
      if (!data) {
        return res
          .status(401)
          .json({ error: true, message: "Invalid Credentials" });
      }

      // Fetch user roles
      const userRoles = await UserRole.findAll({
        where: { user_id: data.user_id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      // Check for admin role
      const hasAdminRole = userRoles.some((role) => role.role_id === 1); // Admin role ID

      if (!hasAdminRole) {
        return res.status(401).json({
          error: true,
          message: "User does not have an admin role!",
        });
      }

      // Validate password
      bcrypt.compare(password, data.password, async (err, result) => {
        if (err) {
          console.error(err); // Log error for debugging
          return res
            .status(500)
            .json({ error: true, message: "Internal Server Error" });
        }

        if (!result) {
          return res
            .status(401)
            .json({ error: true, message: "Invalid Credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: data.user_id },
          config.development.JWT_SECRET,
          { expiresIn: "24h" }
        );

        if (token) {
          res.status(200).json({ error: false, token: token });
        } else {
          console.error("Error generating JWT token"); // Log error for debugging
          res
            .status(500)
            .json({ error: true, message: "Internal Server Error" });
        }
      });
    })
    .catch((e) => {
      console.error(e); // Log error for debugging
      res.status(500).json({ error: true, message: "Internal Server Error" });
    });
};

exports.signup = async (req, res) => {
  const { password, email, name, rolesArray } = req.body;

  // Check if required fields are provided
  if (!password || !email || !name || !rolesArray) {
    return res.status(400).json({
      error: true,
      message: "Please provide proper user details!",
    });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Check if user already exists
    User.findOne({
      where: { email: email, isActive: true },
    }).then(async (existingUser) => {
      if (existingUser) {
        return res.status(400).json({
          error: true,
          message: "User already registered!",
        });
      } else {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashpass = await bcrypt.hash(password, salt);

        // Create the user
        const newUser = await User.create(
          {
            name: name,
            email: email,
            password: hashpass,
            profile_pic: getFileUrl(req?.file),
          },
          { transaction }
        );

        // Process roles array
        for (const role of rolesArray) {
          const roleId = await Role.findOne({ where: { role_id: role } });

          await UserRole.create(
            {
              user_id: newUser.user_id,
              role_id: roleId.role_id,
              role: roleId.role,
            },
            { transaction }
          );
        }

        // Commit the transaction
        await transaction.commit();

        return res.status(200).json({
          error: false,
          message: "User Registered",
        });
      }
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error during registration: ${error.message}`,
    });
  }
};

exports.Userlogin = async (req, res) => {
  const { email, password } = req.body;
  User.findOne({
    where: {
      email: email.toLowerCase(),
      isActive: true
    },
    raw: true,
  })
    .then((data) => {
      bcrypt.compare(password, data.password, async (_err, result) => {
        if (!result) {
          res.status(400).json({
            error: true,
            message: "Invalid Password!",
          });
        } else {
          const token = jwt.sign(
            { userId: data.user_id },
            config.development.JWT_SECRET,
            { expiresIn: "24h" }
          );
          if (token) {
            res.status(200).json({
              error: false,
              token: token,
            });
          } else {
            res.status(400).json({
              error: true,
              message: "Some unknown error",
            });
          }
        }
      });
    })
    .catch((e) => {
      res.status(401).json({
        error: false,
        message: "Couldn't find User!",
      });
    });
};

exports.editUser = async (req, res) => {
  // Check if request body is empty
  if (!req.body && !req.files) {
    return res.status(400).json({
      error: true,
      message: "Please provide details to update!",
    });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Update user details
    const userdetails = {
      name: req.body.name,
      email: req.body.email,
      profile_pic: getFileUrl(req?.file),
    };

    await User.update(userdetails, {
      where: { user_id: req.params.id },
      transaction,
    });

    // Delete existing UserRole entries
    await UserRole.destroy({
      where: { user_id: req.params.id },
      transaction,
    });

    // Process roles array
    const rolesArray = req.body?.rolesArray;
    if (rolesArray?.length) {
      for (const role of rolesArray) {
        const roleId = await Role.findOne({ where: { role_id: role } });

        await UserRole.create(
          {
            user_id: req.params.id,
            role_id: roleId.role_id,
            role: roleId.role,
          },
          { transaction }
        );
      }
    }

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "User Details Updated",
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error during update: ${error.message}`,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne(
      { where: { user_id: req.params.id, isActive: true } },
      { transaction }
    );
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    await User.update(
      { isActive: false },
      {
        where: {
          user_id: req.params.id,
        },
      }
    );

    await transaction.commit();
    res.json({
      error: false,
      message: "User deleted successfully",
    });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  User.findAll({
    where: {
      isActive: true,
    },
    include: {
      model: UserRole,
    },
  })
    .then((result) => {
      res.status(200).json({
        error: false,
        response: result,
      });
    })
    .catch((e) => {
      res.status(400).json({
        error: true,
        response: e.message,
      });
    });
};

exports.resetPassword = async (req, res) => {
  let { user_id, current_password, new_password, confirm_new_password } =
    req.body;

  // Validate input data
  if (!user_id || !current_password || !new_password || !confirm_new_password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (new_password !== confirm_new_password) {
    return res
      .status(400)
      .json({ message: "New password and confirm new password do not match" });
  }

  try {
    // Find the user by ID
    const user = await User.findOne({
      where: { user_id: user_id, isActive: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    // Update the user's password
    await User.update(
      { password: hashedPassword },
      { where: { user_id: user_id } }
    );

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllRoles = (req, res) => {
  Role.findAll()
    .then((result) => {
      res.status(200).json({
        error: false,
        response: result,
      });
    })
    .catch((e) => {
      res.status(400).json({
        error: true,
        response: e.message,
      });
    });
};

exports.getUserPermissions = (req, res) => {
  UserRole.findAll({
    where: {
      user_id: req.params.id,
    },
  })
    .then((result) => {
      res.json({
        error: false,
        message: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: true,
        message: error.message,
      });
    });
};
