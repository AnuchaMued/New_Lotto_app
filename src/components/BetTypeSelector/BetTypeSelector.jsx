// src/components/BetTypeSelector/BetTypeSelector.jsx
import React from "react";
import Button from "../Button/Button"; // Assuming Button is in '../Button/Button'
import styles from "./BetTypeSelector.module.css";

function BetTypeSelector({ betType, handleBetTypeSelect, BET_TYPES }) {
  return (
    <div className={styles.betTypeSelection}>
      {Object.values(BET_TYPES).map((type) => (
        <Button
          key={type}
          onClick={() => handleBetTypeSelect(type)}
          variant={betType === type ? "success" : "secondary"}
          className={styles.betTypeButton}
        >
          {(() => {
            switch (type) {
              case BET_TYPES.THREE_TOP:
                return `3 ตัวบน`;
              case BET_TYPES.THREE_BOTTOM:
                return `3 ตัวล่าง`;
              case BET_TYPES.TWO_TOP:
                return `2 ตัวบน`;
              case BET_TYPES.TWO_BOTTOM:
                return `2 ตัวล่าง`;
              default:
                return "ไม่ระบุ";
            }
          })()}
        </Button>
      ))}
    </div>
  );
}

export default BetTypeSelector;
