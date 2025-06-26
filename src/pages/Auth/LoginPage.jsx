// src/pages/Auth/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";
import styles from "./AuthPage.module.css"; // เราจะสร้างไฟล์นี้ในขั้นตอนถัดไป

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    let errors = {};
    if (!email.trim()) errors.email = "กรุณากรอกอีเมล";
    if (!password) errors.password = "กรุณากรอกรหัสผ่าน";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setNotification({ message: "โปรดแก้ไขข้อผิดพลาดในฟอร์ม", type: "error" });
      return;
    }

    setIsLoading(true);
    setNotification({ message: "", type: "" });

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "การเข้าสู่ระบบไม่สำเร็จ");
      }

      // การเข้าสู่ระบบสำเร็จ: เก็บ token และข้อมูลผู้ใช้ (ในอนาคตจะใช้ Context API)
      localStorage.setItem("userToken", data.token);
      localStorage.setItem(
        "userProfile",
        JSON.stringify({
          _id: data._id,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          bankAccountNumber: data.bankAccountNumber,
          bankName: data.bankName,
          credit: data.credit,
        })
      );

      setNotification({ message: "เข้าสู่ระบบสำเร็จ!", type: "success" });
      setTimeout(() => navigate("/"), 1500); // ไปยังหน้าหลัก
    } catch (error) {
      setNotification({
        message: error.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.title}>เข้าสู่ระบบ</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField
          label="อีเมล:"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="กรอกอีเมล"
          error={formErrors.email}
        />
        <InputField
          label="รหัสผ่าน:"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="กรอกรหัสผ่าน"
          error={formErrors.password}
        />
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className={styles.authButton}
        >
          {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </Button>
      </form>
      <p className={styles.authLinkText}>
        ยังไม่มีบัญชี?{" "}
        <Link to="/register" className={styles.authLink}>
          ลงทะเบียนที่นี่
        </Link>
      </p>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
    </div>
  );
}

export default LoginPage;
