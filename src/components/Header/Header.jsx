// src/components/Header/Header.jsx (เวอร์ชันแก้ไข - รวมโค้ดเดิมและโค้ดใหม่)
import React from "react";
import { Link, useNavigate } from "react-router-dom"; // ต้องเพิ่ม useNavigate
import { FaTicketAlt } from "react-icons/fa";
import styles from "./Header.module.css";

function Header() {
  const navigate = useNavigate(); // เพิ่มบรรทัดนี้

  // ดึงข้อมูลผู้ใช้และ token จาก localStorage เพื่อตรวจสอบสถานะการ Login
  // (นี่เป็นวิธีเบื้องต้น เราจะปรับปรุงไปใช้ Context API/Redux ในอนาคต)
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  const userToken = localStorage.getItem("userToken");

  const handleLogout = () => {
    // ลบ token และ profile ออกจาก localStorage
    localStorage.removeItem("userToken");
    localStorage.removeItem("userProfile");
    // หรือ clear ข้อมูลอื่นๆ ที่เกี่ยวข้องใน localStorage หากมี
    navigate("/login"); // เปลี่ยนเส้นทางกลับไปหน้า Login หลังจาก Logout
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* โลโก้ของคุณ (ยังคงใช้ FaTicketAlt และ h1 เหมือนเดิม) */}
        <h1 className={styles.logo}>
          <Link to="/" className={styles.logoLink}>
            <FaTicketAlt className={styles.logoIcon} />
            Lotto Credit
          </Link>
        </h1>
        <ul className={styles.navLinks}>
          {" "}
          {/* ใช้ className เดิมของคุณ */}
          <li>
            {/* หน้าหลัก ควรจะเห็นได้เสมอไม่ว่าจะ Login หรือไม่ */}
            <Link to="/" className={styles.navItem}>
              หน้าหลัก
            </Link>
          </li>
          {userToken && userProfile ? (
            // --- ส่วนที่แสดงเมื่อผู้ใช้ Login แล้ว ---
            <>
              <li>
                <Link to="/profile" className={styles.navItem}>
                  โปรไฟล์ ({userProfile.username}) {/* แสดงชื่อผู้ใช้ */}
                </Link>
              </li>
              <li>
                <Link to="/history" className={styles.navItem}>
                  ประวัติการทายผล
                </Link>
              </li>
              <li>
                <Link to="/results" className={styles.navItem}>
                  ผลรางวัล
                </Link>
              </li>
              <li>
                {/* ปุ่มออกจากระบบ (ต้องมี style สำหรับ navButton ใน Header.module.css) */}
                <button onClick={handleLogout} className={styles.navButton}>
                  ออกจากระบบ
                </button>
              </li>
            </>
          ) : (
            // --- ส่วนที่แสดงเมื่อผู้ใช้ยังไม่ได้ Login ---
            <>
              <li>
                <Link to="/login" className={styles.navItem}>
                  เข้าสู่ระบบ
                </Link>
              </li>
              <li>
                <Link to="/register" className={styles.navItem}>
                  ลงทะเบียน
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
