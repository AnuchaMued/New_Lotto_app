// src/pages/ResultPage/ResultPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./ResultPage.module.css";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // ดึงข้อมูลที่ส่งมาจาก HomePage (ลบ couponCode ออก)
  const { prediction, betType, status } = location.state || {};

  const [actualLottoResult, setActualLottoResult] = useState(null);
  const [isCheckingResult, setIsCheckingResult] = useState(true);

  const getBetTypeDisplayName = (type) => {
    switch (type) {
      case "3_top":
        return "3 ตัวบน";
      case "3_bottom":
        return "3 ตัวล่าง";
      case "2_top":
        return "2 ตัวบน";
      case "2_bottom":
        return "2 ตัวล่าง";
      default:
        return "ไม่ระบุ";
    }
  };

  useEffect(() => {
    const fetchResult = async () => {
      setIsCheckingResult(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      let simulatedResult;
      if (betType === "3_top" || betType === "3_bottom") {
        simulatedResult = "123";
      } else if (betType === "2_top" || betType === "2_bottom") {
        simulatedResult = "23";
      } else {
        simulatedResult = "XXX";
      }
      setActualLottoResult(simulatedResult);
      setIsCheckingResult(false);
    };

    if (status === "submitted") {
      fetchResult();
    } else if (!prediction) {
      navigate("/");
    }
  }, [status, prediction, navigate, betType]);

  if (!prediction) {
    return (
      <div className={styles.resultPage}>
        <p>กำลังเปลี่ยนเส้นทางกลับหน้าแรก...</p>
      </div>
    );
  }

  let isWinner = false;
  if (actualLottoResult && prediction) {
    if (betType === "3_top" || betType === "3_bottom") {
      isWinner = prediction === actualLottoResult;
    } else if (betType === "2_top" || betType === "2_bottom") {
      isWinner = prediction === actualLottoResult.slice(-2);
    }
  }

  return (
    <div className={styles.resultPage}>
      <h2 className={styles.title}>ผลการทายของคุณ</h2>

      <div className={styles.summaryCard}>
        <p className={styles.summaryItem}>
          <strong>ประเภทการทาย:</strong>{" "}
          <span className={styles.predictionType}>
            {getBetTypeDisplayName(betType)}
          </span>
        </p>
        <p className={styles.summaryItem}>
          <strong>ตัวเลขที่ทาย:</strong>{" "}
          <span className={styles.predictionNumber}>{prediction}</span>
        </p>
        {/* ไม่แสดงรหัสคูปองแล้ว */}
      </div>

      {isCheckingResult ? (
        <div className={styles.loadingSection}>
          <div className={styles.spinner}></div>
          <p>กำลังตรวจสอบผลหวย...</p>
        </div>
      ) : (
        <div className={styles.actualResultSection}>
          <p className={styles.resultLabel}>ผลหวยที่ออก:</p>
          <h3 className={styles.actualNumber}>{actualLottoResult}</h3>

          {isWinner ? (
            <div className={`${styles.resultBox} ${styles.winner}`}>
              <p className={styles.resultEmoji}>🎉</p>
              <h3>ยินดีด้วย! คุณทายถูก!</h3>
              <p>คุณจะได้รับการแจ้งเตือนสำหรับการรับรางวัลในเร็วๆ นี้</p>
            </div>
          ) : (
            <div className={`${styles.resultBox} ${styles.loser}`}>
              <p className={styles.resultEmoji}>😔</p>
              <h3>เสียใจด้วย คุณทายไม่ถูก</h3>
              <p>อย่าเพิ่งท้อแท้ ลองทายใหม่ในงวดหน้า!</p>
            </div>
          )}
        </div>
      )}

      <Button
        onClick={() => navigate("/")}
        variant="primary"
        className={styles.backButton}
      >
        กลับไปหน้าแรก
      </Button>
    </div>
  );
}

export default ResultPage;
