// src/components/CreditWidget/CreditWidget.jsx
import React from "react";
import InputField from "../InputField/InputField"; // Assuming InputField is in '../InputField/InputField'
import Button from "../Button/Button"; // Assuming Button is in '../Button/Button'
import styles from "./CreditWidget.module.css";

function CreditWidget({
  userCredit,
  creditRequestReceipt,
  creditRequestError,
  isRequestingCredit,
  handleCreditRequestReceiptChange,
  handleRequestCredit,
}) {
  return (
    <div className={styles.creditWidget}>
      <div className={styles.creditBalanceInfo}>
        <p className={styles.sectionHeader}>เครดิตคงเหลือ</p>
        <p className={styles.creditAmountValue}>{userCredit} เครดิต</p>
      </div>

      <div className={styles.creditTopUpSection}>
        <h3 className={styles.sectionHeader}>เติมเครดิต</h3>
        <InputField
          label="กรอกเลขที่ใบเสร็จ:"
          type="text"
          placeholder="ตัวอย่าง: ABCDE12345"
          value={creditRequestReceipt}
          onChange={handleCreditRequestReceiptChange}
          id="creditRequestReceiptInput"
        />
        {creditRequestError && (
          <p className={styles.errorText}>{creditRequestError}</p>
        )}
        <Button
          onClick={handleRequestCredit}
          variant="secondary"
          disabled={
            isRequestingCredit ||
            !creditRequestReceipt ||
            creditRequestReceipt.length < 5
          }
          className={styles.creditRequestButton}
        >
          {isRequestingCredit ? "กำลังดำเนินการ..." : "ขอเติมเครดิต"}
        </Button>
      </div>
    </div>
  );
}

export default CreditWidget;
