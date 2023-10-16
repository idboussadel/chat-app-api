const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/all", authController.protect, userController.getAllUsers);
router.get("/:userId", authController.protect, userController.getUser);

module.exports = router;
