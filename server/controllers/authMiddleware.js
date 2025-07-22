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
    if (!token) {
      return errorMessage(res);
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return errorMessage(res);
    }

    req.user = verified.id;
    next();
  } catch {
    return errorMessage(res);
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
