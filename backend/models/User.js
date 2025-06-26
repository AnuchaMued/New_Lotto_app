// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // สำหรับ hash รหัสผ่าน

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6, // กำหนดความยาวขั้นต่ำของรหัสผ่าน
    },
    firstName: {
      type: String,
      trim: true,
      default: "",
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },
    bankAccountNumber: {
      type: String,
      trim: true,
      default: "",
    },
    bankName: {
      type: String,
      trim: true,
      default: "",
    },
    credit: {
      type: Number,
      default: 5, // เครดิตเริ่มต้น 5
    },
    role: {
      type: String,
      enum: ["user", "admin"], // อาจจะมี role admin ในอนาคต
      default: "user",
    },
  },
  {
    timestamps: true, // เพิ่ม createdAt และ updatedAt โดยอัตโนมัติ
  }
);

// Hash password ก่อนที่จะบันทึกผู้ใช้
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // ตรวจสอบว่ามีการแก้ไขรหัสผ่านหรือไม่
    return next();
  }
  const salt = await bcrypt.genSalt(10); // สร้าง salt
  this.password = await bcrypt.hash(this.password, salt); // Hash รหัสผ่าน
  next();
});

// เปรียบเทียบรหัสผ่านที่ป้อนเข้ามากับรหัสผ่านที่ hash ไว้ใน DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
