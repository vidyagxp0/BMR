const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

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
    return `http://localhost:7000/profile_pics/${file?.filename}`;
  }
};


module.exports.checkJwtToken = checkJwtToken
module.exports.getFileUrl = getFileUrl