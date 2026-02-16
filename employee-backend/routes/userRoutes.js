const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const userController = require("../controllers/userController");

router.get("/me", verifyToken, allowRoles("user"), (req, res) => {
    userController.getProfile(req, res);
});

router.put("/me", verifyToken, allowRoles("user"), (req, res) => {
    userController.updateProfile(req, res);
});

module.exports = router;
