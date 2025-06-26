// backend/controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/User"); // ตรวจสอบว่าเส้นทางถูกต้อง

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token หมดอายุใน 1 ชั่วโมง
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      role: user.role, // Include role if you have it in your User model
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName, // เพิ่มฟิลด์ที่ต้องการส่งกลับไป
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      bankAccountNumber: user.bankAccountNumber,
      bankName: user.bankName,
      token: generateToken(user._id),
      role: user.role, // Include role
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // req.user ถูกแนบมาจาก middleware 'protect'
  // โดย req.user จะเป็น object ของผู้ใช้ที่ดึงมาจากฐานข้อมูลแล้ว (id, username, email, etc.)
  if (req.user) {
    // เนื่องจาก req.user.select('-password') ถูกใช้ใน middleware แล้ว
    // ข้อมูลผู้ใช้ที่ส่งมาใน req.user จะไม่มี password
    res.status(200).json(req.user); // ส่งข้อมูลผู้ใช้กลับไป
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // req.user ถูกแนบมาจาก middleware 'protect'
  const userId = req.user._id; // ใช้ _id จาก req.user

  const { firstName, lastName, phoneNumber, bankAccountNumber, bankName } =
    req.body;

  try {
    const user = await User.findById(userId);

    if (user) {
      // อัปเดตฟิลด์ที่ส่งมาใน req.body ถ้ามีค่า หรือใช้ค่าเดิม
      user.firstName = firstName !== undefined ? firstName : user.firstName;
      user.lastName = lastName !== undefined ? lastName : user.lastName;
      user.phoneNumber =
        phoneNumber !== undefined ? phoneNumber : user.phoneNumber;
      user.bankAccountNumber =
        bankAccountNumber !== undefined
          ? bankAccountNumber
          : user.bankAccountNumber;
      user.bankName = bankName !== undefined ? bankName : user.bankName;

      const updatedUser = await user.save(); // บันทึกการเปลี่ยนแปลง

      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phoneNumber: updatedUser.phoneNumber,
        bankAccountNumber: updatedUser.bankAccountNumber,
        bankName: updatedUser.bankName,
        role: updatedUser.role,
        // ไม่ต้องส่ง token กลับมาตรงนี้ก็ได้ถ้าไม่มีการเปลี่ยน
        // หากต้องการอัปเดต token ใหม่ ให้ generateToken(updatedUser._id)
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500);
    throw new Error("Server error during profile update");
  }
});

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { newPassword } = req.body;

  if (!newPassword) {
    res.status(400);
    throw new Error("Please provide a new password");
  }

  // Basic password validation (you might want more robust validation)
  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters long");
  }

  try {
    const user = await User.findById(userId);

    if (user) {
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500);
    throw new Error("Server error during password change");
  }
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  changePassword, // อย่าลืม export ฟังก์ชันเปลี่ยนรหัสผ่าน
};
