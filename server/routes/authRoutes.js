const express = require("express");
const router = express.Router();
const auth = require("../controllers/authMiddleware");
const {
  registerUser,
  loginUser,
  validate,
} = require("../controllers/authController");
const { getUser } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/validate", validate);
router.get("/user", auth, getUser);

module.exports = router;

