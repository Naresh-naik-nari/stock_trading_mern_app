const jwt = require("jsonwebtoken");

const errorMessage = (res) => {
  return res.status(401).json({
    status: "fail",
    message: "Authorization denied, user is not logged in.",
  });
};

const auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    console.log('Auth middleware - Token received:', token ? 'Yes' : 'No');
    if (token) {
      // Log first 10 characters of token for debugging (mask rest)
      console.log('Auth middleware - Token (masked):', token.substring(0, 10) + '...');
    }
    
    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(200).json({
        status: "fail",
        message: "Credentials couldn't be validated.",
      });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Token verified:', verified ? 'Yes' : 'No');
    console.log('Auth middleware - User ID from token:', verified?.id);
    
    if (!verified || !verified.id) {
      console.log('Auth middleware - Token verification failed');
      return res.status(200).json({
        status: "fail",
        message: "Credentials couldn't be validated.",
      });
    }

    req.user = verified.id;
    console.log('Auth middleware - Setting req.user to:', req.user);
    next();
  } catch (error) {
    console.log('Auth middleware - Error:', error.message);
    console.log('Auth middleware - Error name:', error.name);
    
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      console.log('Auth middleware - Token expired');
      return res.status(200).json({
        status: "fail",
        message: "Credentials couldn't be validated. Session expired.",
      });
    } else if (error.name === 'JsonWebTokenError') {
      console.log('Auth middleware - Invalid token');
      return res.status(200).json({
        status: "fail",
        message: "Credentials couldn't be validated. Invalid token.",
      });
    } else {
      console.log('Auth middleware - Other error:', error.name);
      return res.status(200).json({
        status: "fail",
        message: "Credentials couldn't be validated.",
      });
    }
  }
};

const isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ status: "fail", message: "Admin access required." });
  }
  next();
};

const isGuest = (req, res, next) => {
  if (req.userRole !== "guest") {
    return res.status(403).json({ status: "fail", message: "Guest access required." });
  }
  next();
};

module.exports = auth;
module.exports.isAdmin = isAdmin;
module.exports.isGuest = isGuest;
