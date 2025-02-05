const express = require("express");
const router = express.Router();

const authController = require("../controller/authController");
const authorize = require("../middleware/authMiddleware");

router.post("/auth/register", authController.adminRegister);
router.post("/auth/login", authController.adminLogin);

module.exports = router;
