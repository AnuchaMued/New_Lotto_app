// src/pages/NotFoundPage/NotFoundPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import styles from './NotFoundPage.module.css';

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.notFoundPage}>
      <h2>404 - Page Not Found</h2>
      <p>ขออภัย, ไม่พบหน้าที่คุณกำลังมองหา</p>
      <Button onClick={() => navigate('/')} variant="primary">
        กลับไปหน้าแรก
      </Button>
    </div>
  );
}

export default NotFoundPage;