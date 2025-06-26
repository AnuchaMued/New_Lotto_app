// src/pages/PredictionHistoryPage/PredictionHistoryPage.jsx
import React, { useState, useEffect } from "react";
import styles from "./PredictionHistoryPage.module.css";
import Button from "../../components/Button/Button";
import InputField from "../../components/InputField/InputField";

function PredictionHistoryPage() {
  const [predictions, setPredictions] = useState(() => {
    const savedPredictions = localStorage.getItem("userPredictions");
    return savedPredictions
      ? JSON.parse(savedPredictions)
      : [
          // ปรับข้อมูลจำลองให้ไม่มี receiptNumber
          {
            id: "p001",
            betType: "3_top",
            prediction: "123",
            date: "2025-06-01 10:30",
            status: "pending",
            creditUsed: 1,
          },
          {
            id: "p002",
            betType: "2_bottom",
            prediction: "45",
            date: "2025-06-01 11:00",
            status: "pending",
            creditUsed: 1,
          },
          {
            id: "p003",
            betType: "3_top",
            prediction: "789",
            date: "2025-05-15 09:15",
            status: "processed",
            creditUsed: 1,
          },
        ];
  });

  const [editingId, setEditingId] = useState(null);
  const [editedPrediction, setEditedPrediction] = useState("");
  const [editError, setEditError] = useState("");

  useEffect(() => {
    localStorage.setItem("userPredictions", JSON.stringify(predictions));
  }, [predictions]);

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

  const handleEditClick = (predictionId, currentPrediction, betType) => {
    const predictionToEdit = predictions.find((p) => p.id === predictionId);
    if (predictionToEdit && predictionToEdit.status === "processed") {
      setEditError("ไม่สามารถแก้ไขโพยที่ดำเนินการไปแล้วได้");
      return;
    }

    setEditingId(predictionId);
    setEditedPrediction(currentPrediction);
    setEditError("");
  };

  const handleEditedPredictionChange = (e, betType) => {
    const value = e.target.value.trim();
    let maxLength = 0;
    if (betType === "3_top" || betType === "3_bottom") {
      maxLength = 3;
    } else if (betType === "2_top" || betType === "2_bottom") {
      maxLength = 2;
    }

    if (
      new RegExp(
        `^\\d{0,<span class="math-inline">\{maxLength\}\}</span>`
      ).test(value)
    ) {
      setEditedPrediction(value);
      if (value.length === maxLength) setEditError("");
    } else if (value.length > maxLength) {
      setEditError(`กรุณากรอกตัวเลขไม่เกิน ${maxLength} หลัก.`);
    } else {
      setEditError("กรุณากรอกเฉพาะตัวเลข (0-9).");
    }
  };

  const handleSaveEdit = (predictionId, betType) => {
    const requiredLength =
      betType === "3_top" || betType === "3_bottom" ? 3 : 2;
    if (editedPrediction.length !== requiredLength) {
      setEditError(`กรุณากรอกตัวเลข ${requiredLength} หลัก.`);
      return;
    }

    setPredictions((prevPredictions) =>
      prevPredictions.map((p) =>
        p.id === predictionId ? { ...p, prediction: editedPrediction } : p
      )
    );
    setEditingId(null);
    setEditedPrediction("");
    setEditError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedPrediction("");
    setEditError("");
  };

  const handleDeletePrediction = (predictionId) => {
    if (window.confirm("คุณต้องการลบโพยนี้ใช่หรือไม่?")) {
      setPredictions((prevPredictions) =>
        prevPredictions.filter((p) => p.id !== predictionId)
      );
    }
  };

  return (
    <div className={styles.predictionHistoryPage}>
      <h2 className={styles.title}>ประวัติการทายผลของคุณ</h2>

      {predictions.length === 0 ? (
        <p className={styles.noPredictionMessage}>
          คุณยังไม่มีประวัติการทายผล ลองกลับไปที่หน้าแรกและทายผลได้เลย!
        </p>
      ) : (
        <div className={styles.predictionList}>
          {predictions.map((p) => (
            <div key={p.id} className={styles.predictionCard}>
              <div className={styles.cardHeader}>
                <span className={`${styles.statusBadge} ${styles[p.status]}`}>
                  {p.status === "pending"
                    ? "รอผล"
                    : p.status === "processed"
                    ? "ประมวลผลแล้ว"
                    : ""}
                </span>
                <h3 className={styles.betType}>
                  {getBetTypeDisplayName(p.betType)}
                </h3>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.label}>ตัวเลขที่ทาย:</p>
                {editingId === p.id ? (
                  <div className={styles.editInputContainer}>
                    <InputField
                      type="text"
                      value={editedPrediction}
                      onChange={(e) =>
                        handleEditedPredictionChange(e, p.betType)
                      }
                      maxLength={
                        p.betType === "3_top" || p.betType === "3_bottom"
                          ? 3
                          : 2
                      }
                      inputMode="numeric"
                      className={styles.editInputField}
                    />
                    {editError && (
                      <p className={styles.editErrorText}>{editError}</p>
                    )}
                  </div>
                ) : (
                  <p className={styles.predictionNumber}>{p.prediction}</p>
                )}

                {/* <p className={styles.label}>เลขที่ใบเสร็จที่ใช้:</p> <<< ลบออก */}
                {/* <p className={styles.receiptNumber}>{p.receiptNumber}</p> <<< ลบออก */}

                <p className={styles.label}>เครดิตที่ใช้:</p>
                <p className={styles.creditUsed}>{p.creditUsed} เครดิต</p>

                <p className={styles.label}>วันที่/เวลา:</p>
                <p className={styles.date}>{p.date}</p>
              </div>
              <div className={styles.cardActions}>
                {editingId === p.id ? (
                  <>
                    <Button
                      onClick={() => handleSaveEdit(p.id, p.betType)}
                      variant="success"
                      className={styles.actionButton}
                      disabled={editedPrediction.length === 0 || editError}
                    >
                      บันทึก
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="secondary"
                      className={styles.actionButton}
                    >
                      ยกเลิก
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() =>
                        handleEditClick(p.id, p.prediction, p.betType)
                      }
                      variant="primary"
                      className={styles.actionButton}
                      disabled={p.status === "processed"}
                    >
                      แก้ไข
                    </Button>
                    <Button
                      onClick={() => handleDeletePrediction(p.id)}
                      variant="error"
                      className={styles.actionButton}
                    >
                      ลบ
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PredictionHistoryPage;
