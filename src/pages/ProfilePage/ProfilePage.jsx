// src/pages/ProfilePage/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";
import styles from "./ProfilePage.module.css";

function ProfilePage() {
  // State สำหรับข้อมูลผู้ใช้
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");

  // State สำหรับการเปลี่ยนรหัสผ่าน
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // State สำหรับ Validation Error ของข้อมูลโปรไฟล์
  const [profileErrors, setProfileErrors] = useState({});

  // State สำหรับการโหลดและแจ้งเตือน
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // จำลองข้อมูลผู้ใช้เริ่มต้น (สามารถโหลดจาก API จริงได้ในอนาคต)
  useEffect(() => {
    // โหลดข้อมูลจาก Local Storage หรือ Mock Data
    const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    setFirstName(savedProfile.firstName || "");
    setLastName(savedProfile.lastName || "");
    setPhoneNumber(savedProfile.phoneNumber || "");
    setBankAccountNumber(savedProfile.bankAccountNumber || "");
    setBankName(savedProfile.bankName || "");
  }, []);

  // Handler สำหรับการเปลี่ยนแปลงข้อมูลทั่วไป
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileErrors({}); // Clear previous errors
    setNotification({ message: "", type: "" });

    let errors = {};
    if (!firstName.trim()) errors.firstName = "กรุณากรอกชื่อ";
    if (!lastName.trim()) errors.lastName = "กรุณากรอกนามสกุล";

    // Basic phone number validation (10 digits)
    if (!phoneNumber.trim()) {
      errors.phoneNumber = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (!/^\d{10}$/.test(phoneNumber.trim())) {
      errors.phoneNumber = "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก";
    }

    if (!bankAccountNumber.trim()) {
      errors.bankAccountNumber = "กรุณากรอกเลขบัญชีธนาคาร";
    } else if (!/^\d+$/.test(bankAccountNumber.trim())) {
      errors.bankAccountNumber = "เลขบัญชีธนาคารต้องเป็นตัวเลขเท่านั้น";
    }

    if (!bankName.trim()) errors.bankName = "กรุณากรอกชื่อธนาคาร";

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      setNotification({
        message: "โปรดแก้ไขข้อผิดพลาดในข้อมูลส่วนตัว",
        type: "error",
      });
      return;
    }

    setIsUpdatingProfile(true);

    // จำลองการส่งข้อมูลไปยัง Server
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      const updatedProfile = {
        firstName,
        lastName,
        phoneNumber,
        bankAccountNumber,
        bankName,
      };
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile)); // Save to local storage

      setNotification({
        message: "อัปเดตข้อมูลส่วนตัวสำเร็จ!",
        type: "success",
      });
    } catch (error) {
      setNotification({
        message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
        type: "error",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handler สำหรับการเปลี่ยนรหัสผ่าน
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setNotification({ message: "", type: "" });

    if (!newPassword) {
      setPasswordError("กรุณากรอกรหัสผ่านใหม่");
      return;
    }
    // Password complexity: at least 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`])[A-Za-z\d!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`]{6,}$/;

    if (newPassword.length < 6) {
      setPasswordError("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        "รหัสผ่านต้องมีตัวพิมพ์ใหญ่, ตัวพิมพ์เล็ก, ตัวเลข, และอักขระพิเศษอย่างน้อยอย่างละ 1 ตัว"
      );
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setIsChangingPassword(true);

    // จำลองการส่งข้อมูลรหัสผ่านไปยัง Server
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      // ในชีวิตจริง ควรส่งไป Hash และบันทึกใน Database
      // localStorage.setItem('userPassword', newPassword); // ไม่แนะนำในชีวิตจริง
      setNotification({ message: "เปลี่ยนรหัสผ่านสำเร็จ!", type: "success" });
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      setNotification({
        message: error.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน",
        type: "error",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className={styles.profilePage}>
      <h2 className={styles.title}>ข้อมูลผู้ใช้งาน</h2>
      <p className={styles.subtitle}>จัดการข้อมูลส่วนตัวและรหัสผ่านของคุณ</p>

      {/* Profile Information Section */}
      <div className={styles.sectionCard}>
        <h3 className={styles.sectionHeader}>ข้อมูลส่วนตัว</h3>
        <form onSubmit={handleProfileUpdate} className={styles.form}>
          <InputField
            label="ชื่อ:"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            id="firstName"
            placeholder="กรอกชื่อ"
            error={profileErrors.firstName} // Display error
          />
          <InputField
            label="นามสกุล:"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            id="lastName"
            placeholder="กรอกนามสกุล"
            error={profileErrors.lastName} // Display error
          />
          <InputField
            label="เบอร์โทรศัพท์:"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            id="phoneNumber"
            placeholder="ตัวอย่าง: 0812345678"
            error={profileErrors.phoneNumber} // Display error
          />
          <InputField
            label="เลขบัญชีธนาคาร:"
            type="text"
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
            id="bankAccountNumber"
            placeholder="กรอกเลขบัญชี"
            error={profileErrors.bankAccountNumber} // Display error
          />
          <InputField
            label="ชื่อธนาคาร:"
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            id="bankName"
            placeholder="เช่น กสิกรไทย, ไทยพาณิชย์"
            error={profileErrors.bankName} // Display error
          />
          <Button
            type="submit"
            variant="primary"
            disabled={isUpdatingProfile}
            className={styles.submitButton}
          >
            {isUpdatingProfile ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </Button>
        </form>
      </div>

      {/* Change Password Section */}
      <div className={styles.sectionCard}>
        <h3 className={styles.sectionHeader}>เปลี่ยนรหัสผ่าน</h3>
        <form onSubmit={handleChangePassword} className={styles.form}>
          <InputField
            label="รหัสผ่านใหม่:"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPasswordError(""); // Clear error on change
            }}
            id="newPassword"
            placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 6 ตัว)"
          />
          <InputField
            label="ยืนยันรหัสผ่านใหม่:"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => {
              setConfirmNewPassword(e.target.value);
              setPasswordError(""); // Clear error on change
            }}
            id="confirmNewPassword"
            placeholder="ยืนยันรหัสผ่านใหม่"
          />
          {passwordError && <p className={styles.errorText}>{passwordError}</p>}
          <Button
            type="submit"
            variant="secondary"
            disabled={isChangingPassword || !newPassword || !confirmNewPassword}
            className={styles.submitButton}
          >
            {isChangingPassword ? "กำลังเปลี่ยนรหัสผ่าน..." : "เปลี่ยนรหัสผ่าน"}
          </Button>
        </form>
      </div>

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
    </div>
  );
}

export default ProfilePage;
