// src/components/LottoTypeSelector/LottoTypeSelector.jsx
import React from "react";
import Button from "../Button/Button"; // Assuming Button is in '../Button/Button'
import styles from "./LottoTypeSelector.module.css";

function LottoTypeSelector({
  selectedMainLottoType,
  handleMainLottoTypeSelect,
  MAIN_LOTTO_TYPES,
}) {
  return (
    <div className={styles.mainLottoSelection}>
      <h3 className={styles.sectionHeader}>เลือกประเภทหวย</h3>
      <div className={styles.mainLottoButtons}>
        <Button
          onClick={() => handleMainLottoTypeSelect(MAIN_LOTTO_TYPES.THAI_LOTTO)}
          variant={
            selectedMainLottoType === MAIN_LOTTO_TYPES.THAI_LOTTO
              ? "success"
              : "primary"
          }
          className={styles.mainLottoButton}
        >
          หวยรัฐบาลไทย
        </Button>
        <Button
          onClick={() => handleMainLottoTypeSelect(MAIN_LOTTO_TYPES.LAO_LOTTO)}
          variant={
            selectedMainLottoType === MAIN_LOTTO_TYPES.LAO_LOTTO
              ? "success"
              : "primary"
          }
          className={styles.mainLottoButton}
        >
          หวยลาว
        </Button>
      </div>
    </div>
  );
}

export default LottoTypeSelector;
