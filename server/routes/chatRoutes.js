const express = require("express");
const router = express.Router();
const auth = require("../controllers/authMiddleware");
const { chatWithAI } = require("../controllers/chatController");

// Protected route - only logged in users can chat with AI
router.post("/", auth, chatWithAI);

module.exports = router;
