const express = require("express");
const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/auth");

const multer = require("multer");
const router = express.Router();
const upload = multer();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/:userId/profile", authenticate, userController.getProfile);

module.exports = router;
