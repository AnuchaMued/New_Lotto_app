// src/pages/Auth/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";
import styles from "./AuthPage.module.css"; // เราจะสร้างไฟล์นี้ในขั้นตอนถัดไป

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    let errors = {};
    if (!username.trim()) errors.username = "กรุณากรอกชื่อผู้ใช้งาน";
    if (!email.trim()) errors.email = "กรุณากรอกอีเมล";
    else if (!/\S+@\S+\.\S+/.test(email))
      errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (!password) errors.password = "กรุณากรอกรหัสผ่าน";
    else if (password.length < 6)
      errors.password = "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร";
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`])[A-Za-z\d!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`]{6,}$/.test(
        password
      )
    ) {
      errors.password =
        "รหัสผ่านต้องมีตัวพิมพ์ใหญ่, ตัวพิมพ์เล็ก, ตัวเลข, และอักขระพิเศษอย่างน้อยอย่างละ 1 ตัว";
    }
    if (password !== confirmPassword)
      errors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
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
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "การลงทะเบียนไม่สำเร็จ");
      }

      // การลงทะเบียนสำเร็จ: เก็บ token และข้อมูลผู้ใช้ (ในอนาคตจะใช้ Context API)
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

      setNotification({
        message: "ลงทะเบียนสำเร็จ! กำลังเข้าสู่ระบบ...",
        type: "success",
      });
      setTimeout(() => navigate("/"), 1500); // ไปยังหน้าหลัก
    } catch (error) {
      setNotification({
        message: error.message || "เกิดข้อผิดพลาดในการลงทะเบียน",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.title}>ลงทะเบียน</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField
          label="ชื่อผู้ใช้งาน:"
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="กรอกชื่อผู้ใช้งาน"
          error={formErrors.username}
        />
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
          placeholder="อย่างน้อย 6 ตัวอักษร (มีตัวพิมพ์ใหญ่-เล็ก, ตัวเลข, สัญลักษณ์)"
          error={formErrors.password}
        />
        <InputField
          label="ยืนยันรหัสผ่าน:"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="ยืนยันรหัสผ่าน"
          error={formErrors.confirmPassword}
        />
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className={styles.authButton}
        >
          {isLoading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
        </Button>
      </form>
      <p className={styles.authLinkText}>
        มีบัญชีอยู่แล้ว?{" "}
        <Link to="/login" className={styles.authLink}>
          เข้าสู่ระบบ
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

export default RegisterPage;
