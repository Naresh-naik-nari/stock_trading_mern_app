const express = require("express");
const router = express.Router();
const auth = require("../controllers/authMiddleware");
const { purchaseStock, sellStock, getStockForUser, resetAccount } = require("../controllers/stockController");

// routes/stockRoutes.js
router.route("/buy").post(auth, purchaseStock);
router.route("/sell").patch(auth, sellStock);
router.route("/adduser/:id").get(auth, getStockForUser);
router.route("/deleteuser/:id").delete(auth, resetAccount);


module.exports = router;
