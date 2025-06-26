// src/components/Notification/Notification.jsx
import React, { useEffect, useRef } from "react";
import styles from "./Notification.module.css";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa"; // Icons

function Notification({ message, type, onClose, duration = 3000 }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (message) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, duration);
    }
    return () => {
      clearTimeout(timerRef.current);
    };
  }, [message, duration, onClose]);

  if (!message) return null;

  let icon;
  let notificationClass = styles.notification;

  switch (type) {
    case "success":
      icon = <FaCheckCircle className={styles.icon} />;
      notificationClass += ` ${styles.success}`;
      break;
    case "error":
      icon = <FaTimesCircle className={styles.icon} />;
      notificationClass += ` ${styles.error}`;
      break;
    default: // info
      icon = <FaInfoCircle className={styles.icon} />;
      notificationClass += ` ${styles.info}`;
      break;
  }

  return (
    <div className={notificationClass}>
      {icon}
      <p className={styles.message}>{message}</p>
      <button onClick={onClose} className={styles.closeButton}>
        &times;
      </button>
    </div>
  );
}

export default Notification;
