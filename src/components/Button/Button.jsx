// src/components/Button/Button.jsx
import React from 'react';
import styles from './Button.module.css'; // Import styles from CSS Module

function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false }) {
  const buttonClasses = `${styles.button} ${styles[variant]}`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;