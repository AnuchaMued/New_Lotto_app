// src/pages/HomePage/HomePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import InputField from '../../components/InputField/InputField'; // No longer directly used in HomePage JSX
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";
import CreditWidget from "../../components/CreditWidget/CreditWidget";
import LottoTypeSelector from "../../components/LottoTypeSelector/LottoTypeSelector";
import BetTypeSelector from "../../components/BetTypeSelector/BetTypeSelector";
import PredictionForm from "../../components/PredictionForm/PredictionForm"; // Import the new PredictionForm
import styles from "./HomePage.module.css";

function HomePage() {
  const [selectedMainLottoType, setSelectedMainLottoType] = useState(null);

  const [prediction, setPrediction] = useState("");
  const [betType, setBetType] = useState(null);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  const [predictionCreditCost, setPredictionCreditCost] = useState(1);

  const [userCredit, setUserCredit] = useState(() => {
    const savedCredit = localStorage.getItem("userCredit");
    return savedCredit ? parseInt(savedCredit, 10) : 5;
  });

  const BET_TYPE_DEFAULT_COSTS = {
    "3_top": 1,
    "3_bottom": 1,
    "2_top": 1,
    "2_bottom": 1,
  };

  const [creditRequestReceipt, setCreditRequestReceipt] = useState("");
  const [creditRequestError, setCreditRequestError] = useState("");
  const [isRequestingCredit, setIsRequestingCredit] = useState(false);

  useEffect(() => {
    localStorage.setItem("userCredit", userCredit.toString());
  }, [userCredit]);

  const MAIN_LOTTO_TYPES = {
    THAI_LOTTO: "thai_lotto",
    LAO_LOTTO: "lao_lotto",
  };

  const BET_TYPES = {
    THREE_TOP: "3_top",
    THREE_BOTTOM: "3_bottom",
    TWO_TOP: "2_top",
    TWO_BOTTOM: "2_bottom",
  };

  // --- Handlers (remain in HomePage as they manage HomePage's state) ---
  const handlePredictionChange = (e) => {
    const value = e.target.value.trim();
    let maxLength = 0;
    if (betType === BET_TYPES.THREE_TOP || betType === BET_TYPES.THREE_BOTTOM) {
      maxLength = 3;
    } else if (
      betType === BET_TYPES.TWO_TOP ||
      betType === BET_TYPES.TWO_BOTTOM
    ) {
      maxLength = 2;
    }
    if (new RegExp(`^\\d{0,${maxLength}}$`).test(value)) {
      setPrediction(value);
      setFormError("");
    } else if (value.length > maxLength) {
      setFormError(`กรุณากรอกตัวเลขไม่เกิน ${maxLength} หลัก.`);
    } else {
      setFormError("กรุณากรอกเฉพาะตัวเลข (0-9).");
    }
  };

  const handleCreditRequestReceiptChange = (e) => {
    setCreditRequestReceipt(e.target.value.trim());
    setCreditRequestError("");
  };

  const handleMainLottoTypeSelect = (type) => {
    setSelectedMainLottoType(type);
    setBetType(null);
    setPrediction("");
    setFormError("");
    setPredictionCreditCost(1);
  };

  const handleBetTypeSelect = (type) => {
    setBetType(type);
    setPrediction("");
    setFormError("");
    setPredictionCreditCost(BET_TYPE_DEFAULT_COSTS[type] || 1);
  };

  const handlePredictionCreditCostChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      setPredictionCreditCost(1);
    } else if (value > userCredit) {
      setPredictionCreditCost(userCredit);
    } else {
      setPredictionCreditCost(value);
    }
    setFormError("");
  };

  const handleRequestCredit = async () => {
    if (!creditRequestReceipt) {
      setCreditRequestError("กรุณากรอกเลขที่ใบเสร็จเพื่อขอเครดิต");
      return;
    }
    if (creditRequestReceipt.length < 5) {
      setCreditRequestError("เลขที่ใบเสร็จไม่ถูกต้อง");
      return;
    }

    setIsRequestingCredit(true);
    setCreditRequestError("");
    setNotification({ message: "", type: "" });

    console.log("จำลองการส่งเลขใบเสร็จเพื่อขอเครดิต:", creditRequestReceipt);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (creditRequestReceipt === "11111") {
        setUserCredit((prev) => prev + 5);
        setNotification({
          message: "เติมเครดิต 5 แต้มสำเร็จ!",
          type: "success",
        });
        setCreditRequestReceipt("");
      } else if (creditRequestReceipt === "22222") {
        setUserCredit((prev) => prev + 10);
        setNotification({
          message: "เติมเครดิต 10 แต้มสำเร็จ!",
          type: "success",
        });
        setCreditRequestReceipt("");
      } else {
        throw new Error("เลขที่ใบเสร็จไม่ถูกต้องหรือไม่สามารถใช้เติมเครดิตได้");
      }
    } catch (err) {
      setNotification({
        message: err.message || "เกิดข้อผิดพลาดในการขอเครดิต โปรดลองใหม่.",
        type: "error",
      });
    } finally {
      setIsRequestingCredit(false);
    }
  };

  const handleSubmit = async () => {
    let requiredLength = 0;
    if (betType === BET_TYPES.THREE_TOP || betType === BET_TYPES.THREE_BOTTOM) {
      requiredLength = 3;
    } else if (
      betType === BET_TYPES.TWO_TOP ||
      betType === BET_TYPES.TWO_BOTTOM
    ) {
      requiredLength = 2;
    }

    if (!betType) {
      setFormError("กรุณาเลือกประเภทการทายผล.");
      return;
    }
    if (prediction.length !== requiredLength) {
      setFormError(`กรุณากรอกตัวเลข ${requiredLength} หลักให้ครบถ้วน.`);
      return;
    }
    if (predictionCreditCost < 1 || isNaN(predictionCreditCost)) {
      setFormError("จำนวนเครดิตที่ใช้ต้องเป็นตัวเลขจำนวนเต็มบวก.");
      return;
    }
    if (userCredit < predictionCreditCost) {
      setFormError(
        `เครดิตไม่พอสำหรับทำรายการนี้ (ใช้ ${predictionCreditCost} เครดิต). กรุณาเติมเครดิต.`
      );
      return;
    }

    setIsLoading(true);
    setFormError("");
    setNotification({ message: "", type: "" });

    console.log("จำลองการส่งข้อมูล:");
    console.log("ประเภทหวยหลัก:", selectedMainLottoType);
    console.log("ประเภทการทาย:", betType);
    console.log("ตัวเลขที่ทาย:", prediction);
    console.log("เครดิตที่ใช้:", predictionCreditCost);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setUserCredit((prev) => prev - predictionCreditCost);

      const newPredictionEntry = {
        id: `p${Date.now()}`,
        mainLottoType: selectedMainLottoType,
        betType: betType,
        prediction: prediction,
        date: new Date().toLocaleString("th-TH", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        status: "pending",
        creditUsed: predictionCreditCost,
      };

      const existingPredictions = JSON.parse(
        localStorage.getItem("userPredictions") || "[]"
      );
      localStorage.setItem(
        "userPredictions",
        JSON.stringify([...existingPredictions, newPredictionEntry])
      );

      setNotification({
        message: `ส่งคำทายเรียบร้อยแล้ว! ใช้ ${predictionCreditCost} เครดิต`,
        type: "success",
      });
      setTimeout(() => {
        navigate("/results", {
          state: { prediction, betType, status: "submitted" },
        });
      }, 1500);
    } catch (err) {
      console.error("Submission failed:", err.message);
      setNotification({
        message: err.message || "เกิดข้อผิดพลาดในการส่งคำทาย โปรดลองอีกครั้ง.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.homePage}>
      <h2 className={styles.title}>ทายผลหวยรัฐบาลด้วยเครดิตของคุณ!</h2>
      <p className={styles.subtitle}>
        เลือกประเภทการทายผลที่คุณต้องการ แล้วกรอกตัวเลขเพื่อทายผล
      </p>

      <CreditWidget
        userCredit={userCredit}
        creditRequestReceipt={creditRequestReceipt}
        creditRequestError={creditRequestError}
        isRequestingCredit={isRequestingCredit}
        handleCreditRequestReceiptChange={handleCreditRequestReceiptChange}
        handleRequestCredit={handleRequestCredit}
      />

      {!selectedMainLottoType ? (
        <LottoTypeSelector
          selectedMainLottoType={selectedMainLottoType}
          handleMainLottoTypeSelect={handleMainLottoTypeSelect}
          MAIN_LOTTO_TYPES={MAIN_LOTTO_TYPES}
        />
      ) : (
        <>
          <Button
            onClick={() => handleMainLottoTypeSelect(null)}
            variant="secondary"
            className={styles.backButton}
          >
            &lt; กลับไปเลือกประเภทหวยหลัก
          </Button>

          <BetTypeSelector
            betType={betType}
            handleBetTypeSelect={handleBetTypeSelect}
            BET_TYPES={BET_TYPES}
          />

          {/* Use the new PredictionForm component */}
          <PredictionForm
            betType={betType}
            prediction={prediction}
            predictionCreditCost={predictionCreditCost}
            userCredit={userCredit}
            formError={formError}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            handlePredictionChange={handlePredictionChange}
            handlePredictionCreditCostChange={handlePredictionCreditCostChange}
            BET_TYPES={BET_TYPES}
          />
        </>
      )}

      <p className={styles.disclaimer}>
        *การทายผลแต่ละครั้งจะใช้เครดิตตามที่คุณกำหนด.
        เครดิตสามารถเติมได้จากเลขที่ใบเสร็จที่คุณได้จากการซื้อสินค้า.
      </p>

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
    </div>
  );
}

export default HomePage;
