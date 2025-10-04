import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Confirm.css";
import { useTranslation } from "react-i18next";

const Confirm = () => {
  const navigate = useNavigate();
  const inputs = Array.from({ length: 6 }, () => useRef());
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState(Array(6).fill(""));
  const [showCode, setShowCode] = useState(""); // لإظهار الكود
  const { t } = useTranslation();

  useEffect(() => {
    inputs[0].current.focus();
    const storedCode = localStorage.getItem("confirmationCode");
    if (storedCode) {
      setShowCode(storedCode); // حفظ الكود لعرضه
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (index < 5) {
        inputs[index + 1].current.focus();
      }
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
      if (index > 0) inputs[index - 1].current.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputs[index - 1].current.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputs[index + 1].current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredCode = code.join("").trim();
    const storedCode = (localStorage.getItem("confirmationCode") || "").trim();

    if (enteredCode === storedCode && enteredCode !== "") {
      setSuccess(true);
      setError("");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      setError("❌ Invalid code. Try again.");
    }
  };

  return (
    <div className="confirm-wrapper">
      <form className={`confirm-form ${success ? "animate-success" : ""}`} onSubmit={handleSubmit}>
        <div className="inputs-container">
          {inputs.map((ref, index) => (
            <input
              key={index}
              ref={ref}
              type="text"
              maxLength={1}
              className="confirmInput"
              value={code[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="submit"
          className="submitButton"
          disabled={code.some((digit) => digit === "")}
        >
          {t("create an account")}
        </button>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">✅ Account created successfully!</div>}

        {showCode && (
          <div className="confirmation-code-info">
            <p style={{ fontSize: "16px", color: "#ccc", marginTop: "20px" }}>
              <strong>Code sent to your email:</strong> {showCode}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Confirm;
