// backend/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // ตรวจสอบว่ามีผู้ใช้ด้วย username หรือ email นี้อยู่แล้วหรือไม่
    const userExistsByUsername = await User.findOne({ username });
    if (userExistsByUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }
    const userExistsByEmail = await User.findOne({ email });
    if (userExistsByEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // สร้างผู้ใช้ใหม่
    const user = await User.create({
      username,
      email,
      password,
    });

    // สร้าง JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: token,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      bankAccountNumber: user.bankAccountNumber,
      bankName: user.bankName,
      credit: user.credit,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid credentials (email not found)" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials (password incorrect)" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: token,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      bankAccountNumber: user.bankAccountNumber,
      bankName: user.bankName,
      credit: user.credit,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

// @desc    Get user profile (Private Route)
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      bankAccountNumber: user.bankAccountNumber,
      bankName: user.bankName,
      credit: user.credit,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Update user profile (Private Route)
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    // <--- เพิ่ม try block ตรงนี้
    const user = await User.findById(req.user.id);

    if (user) {
      // อัปเดตฟิลด์ที่ส่งมา ถ้ามีค่าใหม่ให้ใช้ค่าใหม่ ถ้าไม่มีให้ใช้ค่าเดิม
      user.username = req.body.username || user.username; // อาจจะไม่อัปเดต username ผ่าน profile page ก็ได้ แต่ถ้ามีก็ควรใส่ไว้
      user.email = req.body.email || user.email; // อาจจะไม่อัปเดต email ผ่าน profile page ก็ได้
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.bankAccountNumber =
        req.body.bankAccountNumber || user.bankAccountNumber;
      user.bankName = req.body.bankName || user.bankName; // ตรวจสอบและอัปเดตรหัสผ่าน ถ้ามีการส่งรหัสผ่านใหม่มา

      if (req.body.password) {
        user.password = req.body.password; // Mongoose pre-save hook จะจัดการการ hash
      }

      const updatedUser = await user.save(); // นี่คือการบันทึกข้อมูลที่อัปเดตลงใน MongoDB

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phoneNumber: updatedUser.phoneNumber,
        bankAccountNumber: updatedUser.bankAccountNumber,
        bankName: updatedUser.bankName,
        credit: updatedUser.credit,
        role: updatedUser.role,
      });
    } else {
      // ถ้าไม่พบผู้ใช้ด้วย ID ที่แนบมากับ Token (ไม่น่าเกิดขึ้นถ้า protect middleware ทำงานถูกต้อง)
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // <--- เพิ่ม catch block ตรงนี้เพื่อจับ error จาก user.save()
    console.error("Error updating user profile:", error); // พิมพ์ error ใน console ของ server // ตรวจสอบว่าเป็น ValidationError จาก Mongoose หรือไม่
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    } // สำหรับ error อื่นๆ (เช่น MongoDB connection issues)
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
