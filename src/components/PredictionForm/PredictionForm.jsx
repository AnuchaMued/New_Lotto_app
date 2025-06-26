// src/components/PredictionForm/PredictionForm.jsx
import React from "react";
import InputField from "../InputField/InputField"; // Assuming InputField is in '../InputField/InputField'
import Button from "../Button/Button"; // Assuming Button is in '../Button/Button'
import styles from "./PredictionForm.module.css";

function PredictionForm({
  betType,
  prediction,
  predictionCreditCost,
  userCredit,
  formError,
  isLoading,
  handleSubmit,
  handlePredictionChange,
  handlePredictionCreditCostChange,
  BET_TYPES, // Pass BET_TYPES down to determine input maxLength
}) {
  const requiredLength =
    betType === BET_TYPES.THREE_TOP || betType === BET_TYPES.THREE_BOTTOM
      ? 3
      : 2;

  return (
    <div className={styles.formContainer}>
      {betType && (
        <>
          <div className={styles.formGroup}>
            <InputField
              label={`ตัวเลขที่ทาย (${requiredLength} หลัก):`}
              type="text"
              placeholder={`เช่น ${requiredLength === 3 ? "123" : "45"}`}
              value={prediction}
              onChange={handlePredictionChange}
              inputMode="numeric"
              pattern={`[0-9]{${requiredLength}}`}
              maxLength={requiredLength}
              id="predictionInput"
            />
          </div>

          <div className={styles.formGroup}>
            <InputField
              label="จำนวนเครดิตที่ใช้ (ต่อบาท):"
              type="number"
              value={predictionCreditCost}
              onChange={handlePredictionCreditCostChange}
              min="1"
              max={userCredit > 0 ? userCredit : 1}
              step="1"
              id="creditCostInput"
              className={styles.creditCostInput}
            />
          </div>
          {formError && <p className={styles.errorText}>{formError}</p>}
        </>
      )}

      <Button
        onClick={handleSubmit}
        variant="primary"
        disabled={
          !betType ||
          prediction.length === 0 ||
          prediction.length !== requiredLength ||
          isLoading ||
          formError ||
          userCredit < predictionCreditCost
        }
      >
        {isLoading ? "กำลังส่งคำทาย..." : "ส่งคำทาย"}
      </Button>
      {isLoading && <p className={styles.loadingText}>โปรดรอสักครู่...</p>}
    </div>
  );
}

export default PredictionForm;
