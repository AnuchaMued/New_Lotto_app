// src/pages/ProfilePage/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";
import styles from "./ProfilePage.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  // useEffect เพื่อดึงข้อมูลโปรไฟล์เมื่อ Component โหลด
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setIsUpdatingProfile(true); // ใช้ loading state ของการอัปเดตโปรไฟล์สำหรับโหลดด้วย
        const response = await axios.get("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const fetchedProfile = response.data;

        // ตั้งค่า state ด้วยข้อมูลที่ดึงมา
        setFirstName(fetchedProfile.firstName || "");
        setLastName(fetchedProfile.lastName || "");
        setPhoneNumber(fetchedProfile.phoneNumber || "");
        setBankAccountNumber(fetchedProfile.bankAccountNumber || "");
        setBankName(fetchedProfile.bankName || "");
        // อัปเดต userProfile ใน localStorage ด้วยข้อมูลล่าสุด
        localStorage.setItem("userProfile", JSON.stringify(fetchedProfile));
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setNotification({
          message:
            error.response?.data?.message || "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้",
          type: "error",
        });
        // ถ้าเกิด Error เช่น Token หมดอายุ ให้ Logout
        if (error.response?.status === 401) {
          localStorage.removeItem("userToken");
          localStorage.removeItem("userProfile");
          navigate("/login");
        }
      } finally {
        setIsUpdatingProfile(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // ฟังก์ชันสำหรับ Validate ฟอร์มโปรไฟล์
  const validateProfileForm = () => {
    let errors = {};
    if (!firstName.trim()) errors.firstName = "กรุณากรอกชื่อจริง";
    if (!lastName.trim()) errors.lastName = "กรุณากรอกนามสกุล";
    if (!phoneNumber.trim()) {
      errors.phoneNumber = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      errors.phoneNumber = "เบอร์โทรศัพท์ไม่ถูกต้อง (10 หลัก)";
    }
    // สามารถเพิ่ม validation สำหรับ bankAccountNumber และ bankName ได้ตามต้องการ
    return errors;
  };

  // ฟังก์ชันสำหรับจัดการการอัปเดตข้อมูลโปรไฟล์
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const errors = validateProfileForm();
    setProfileErrors(errors);

    if (Object.keys(errors).length > 0) {
      setNotification({ message: "โปรดแก้ไขข้อผิดพลาดในฟอร์ม", type: "error" });
      return;
    }

    setIsUpdatingProfile(true);
    setNotification({ message: "", type: "" }); // Clear previous notifications

    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        setNotification({
          message: "ไม่พบโทเค็นผู้ใช้ กรุณาเข้าสู่ระบบใหม่",
          type: "error",
        });
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      };

      const { data } = await axios.put(
        "/api/auth/profile",
        { firstName, lastName, phoneNumber, bankAccountNumber, bankName },
        config
      );

      // อัปเดตข้อมูลใน Local Storage หลังอัปเดตสำเร็จ
      localStorage.setItem("userProfile", JSON.stringify(data));

      setNotification({
        message: "บันทึกข้อมูลโปรไฟล์สำเร็จ!",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      setNotification({
        message:
          error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลโปรไฟล์ได้",
        type: "error",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนรหัสผ่าน
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmNewPassword) {
      setPasswordError("กรุณากรอกรหัสผ่านใหม่และยืนยันรหัสผ่าน");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("รหัสผ่านใหม่และการยืนยันไม่ตรงกัน");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setIsChangingPassword(true);
    setNotification({ message: "", type: "" });

    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        setNotification({
          message: "ไม่พบโทเค็นผู้ใช้ กรุณาเข้าสู่ระบบใหม่",
          type: "error",
        });
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      };

      await axios.put("/api/auth/change-password", { newPassword }, config);
      setNotification({ message: "เปลี่ยนรหัสผ่านสำเร็จ!", type: "success" });
      setNewPassword("");
      setConfirmNewPassword("");
      setPasswordError("");
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError(
        error.response?.data?.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้"
      );
      setNotification({
        message: error.response?.data?.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้",
        type: "error",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className={styles.profilePage}>
      <h2 className={styles.title}>ข้อมูลโปรไฟล์</h2>

      <div className={styles.section}>
        <h3 className={styles.sectionHeader}>รายละเอียดส่วนตัว</h3>
        <form onSubmit={handleUpdateProfile} className={styles.form}>
          <InputField
            label="ชื่อจริง:"
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setProfileErrors({ ...profileErrors, firstName: "" });
            }}
            id="firstName"
            placeholder="กรอกชื่อจริง"
            error={profileErrors.firstName}
          />
          <InputField
            label="นามสกุล:"
            type="text"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setProfileErrors({ ...profileErrors, lastName: "" });
            }}
            id="lastName"
            placeholder="กรอกนามสกุล"
            error={profileErrors.lastName}
          />
          <InputField
            label="เบอร์โทรศัพท์:"
            type="text"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setProfileErrors({ ...profileErrors, phoneNumber: "" });
            }}
            id="phoneNumber"
            placeholder="กรอกเบอร์โทรศัพท์"
            error={profileErrors.phoneNumber}
          />
          <InputField
            label="เลขบัญชีธนาคาร:"
            type="text"
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
            id="bankAccountNumber"
            placeholder="กรอกเลขบัญชีธนาคาร"
          />
          <InputField
            label="ชื่อธนาคาร:"
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            id="bankName"
            placeholder="กรอกชื่อธนาคาร"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={isUpdatingProfile}
            className={styles.submitButton}
          >
            {isUpdatingProfile ? "กำลังบันทึก..." : "บันทึกข้อมูลโปรไฟล์"}
          </Button>
        </form>
      </div>

      <div className={styles.section}>
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
            label="ยืนยันรหัสผ่านใหม่:ᐟ"
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
