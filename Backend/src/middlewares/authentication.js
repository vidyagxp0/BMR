const jwt = require("jsonwebtoken");
const config = require("../config/config.json");
const UserRole = require("../models/userRole.model");
const e = require("express");

function checkJwtToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized User",
    });
  }

  jwt.verify(token, config.development.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized User",
      });
    }
    req.user = decoded;
    next();
  });
}

const getFileUrl = (file) => {
  if (file?.filename) {
    return `https://bmrapi.mydemosoftware.com/profile_pics/${file?.filename}`;
  }
};

function authorizeUserRole(roleId) {
  return (req, res, next) => {
    UserRole.findAll({
      where: {
        user_id: req.user.userId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    })
      .then((userRoles) => {
        if (hasAccess(userRoles, roleId)) {
          next(); // User has access, proceed to the next middleware or route handler
        } else {
          res.status(403).json({
            message: "Forbidden: You do not have required permissions.",
          });
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
}

function hasAccess(userRoles, roleId) {
  return userRoles.some(
    (role) =>
      role.role_id === 1 || role.role_id === 6 || role.role_id === roleId
  );
}

module.exports.checkJwtToken = checkJwtToken;
module.exports.getFileUrl = getFileUrl;
module.exports.authorizeUserRole = authorizeUserRole;
