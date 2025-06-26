// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  changePassword,
} = require("../controllers/authController"); // ตรวจสอบเส้นทางให้ถูกต้อง

const { protect } = require("../middleware/authMiddleware"); // ตรวจสอบเส้นทางให้ถูกต้อง

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private Routes (ต้องมีการยืนยันตัวตนด้วย protect middleware)
// ตรวจสอบให้แน่ใจว่า getMe, updateUserProfile, changePassword เป็นฟังก์ชันที่ถูก export ออกมา
router.get("/profile", protect, getMe);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;
