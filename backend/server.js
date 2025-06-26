// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes"); // <--- เพิ่มบรรทัดนี้

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ทดสอบ Route พื้นฐาน
app.get("/", (req, res) => {
  res.send("Lotto Credit Backend API is running!");
});

// กำหนด Routes
app.use("/api/auth", authRoutes); // <--- เพิ่มบรรทัดนี้: ทุก Route ใน authRoutes จะมี prefix เป็น /api/auth

// เชื่อมต่อ MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });
