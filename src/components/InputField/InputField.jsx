// src/components/InputField/InputField.jsx
import React from "react";
import styles from "./InputField.module.css";

function InputField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  ...props
}) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id} className={styles.inputLabel}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.inputField} ${error ? styles.inputError : ""}`}
        {...props}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}{" "}
      {/* <--- เพิ่มส่วนนี้ */}
    </div>
  );
}

export default InputField;
