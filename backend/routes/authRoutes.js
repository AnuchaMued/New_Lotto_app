const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin-only route (ตัวอย่าง)
// router.get("/admin", protect, admin, adminController);

module.exports = router;