// src/App.jsx (เวอร์ชันแก้ไข - รวมโค้ดเก่าและใหม่)
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage/HomePage";
import PredictionHistoryPage from "./pages/PredictionHistoryPage/PredictionHistoryPage";
import ResultPage from "./pages/ResultPage/ResultPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

// --- เพิ่ม Import สำหรับหน้า Login/Register ---
import RegisterPage from "./pages/Auth/RegisterPage";
import LoginPage from "./pages/Auth/LoginPage";
// ---------------------------------------------

import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<PredictionHistoryPage />} />
            <Route path="/results" element={<ResultPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* --- เพิ่ม Route สำหรับหน้า Login/Register --- */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* --------------------------------------------- */}
            <Route path="*" element={<NotFoundPage />} />{" "}
            {/* Route นี้ควรอยู่ท้ายสุดเสมอ */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
