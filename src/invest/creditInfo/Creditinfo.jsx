import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "./creditinfo.css";
import { Link } from "react-router-dom";

const CREDIT_CARD_SUBMITTED_KEY = "hasSubmittedCreditCard";

const CreditCardForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Directly store and show success message without processing alert
      localStorage.setItem(CREDIT_CARD_SUBMITTED_KEY, "true");
      localStorage.setItem("fakeCreditCardData", JSON.stringify(cardData));

      await Swal.fire({
        icon: "success",
        title: t("success"),
        text: t("card_saved_successfully"),
        
        confirmButtonText: t("continue"),
        timer: 6000,
        timerProgressBar: true,
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });

      navigate("/creditcardinfo");
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="credit-container">
      <h1 className="risk" data-text={t("risk_warning")}>
        {t("risk_warning")}
      </h1>

      <form className="credit-card-form" onSubmit={handleSubmit}>
        <h2>{t("credit_card_info")}</h2>

        <div className="form-group">
          <label>{t("cardholder_name")}</label>
          <input
            type="text"
            name="name"
            value={cardData.name}
            onChange={handleChange}
            placeholder={t("enter_name_placeholder")}
          />
          <div className="underline"></div>
        </div>

        <div className="form-group">
          <label>{t("card_number")}</label>
          <input
            type="text"
            name="number"
            value={cardData.number}
            onChange={handleChange}
            placeholder={t("enter_card_number_placeholder")}
          />
          <div className="underline"></div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t("expiry_date")}</label>
            <input
              type="text"
              name="expiry"
              value={cardData.expiry}
              onChange={handleChange}
              placeholder={t("enter_expiry_placeholder")}
            />
            <div className="underline"></div>
          </div>

          <div className="form-group">
            <label>{t("cvv")}</label>
            <input
              type="text"
              name="cvv"
              value={cardData.cvv}
              onChange={handleChange}
              placeholder={t("enter_cvv_placeholder")}
            />
            <div className="underline"></div>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}>
            <span>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </span>
        </button>
      </form>
    </div>
  );
};

export default CreditCardForm;
