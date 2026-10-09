const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      message: "Unathorized access",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
  };

  const isAdmin = (req, res, next) => {
    const user = req.user;

    if (user.role == "admin") {
      return next();
    }

    return res.status(403).json({
      message: "Access denied, Admin only",
    });
  };


module.exports = { verifyToken, isAdmin };