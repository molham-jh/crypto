import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div
      className="container"
      style={{
        width: "250px",
        height: "250px",
        borderRadius: "30px",
        margin: "40px",
        padding: "20px",
        background:
          "linear-gradient(to bottom, rgba(115, 245, 8, 0.66), rgba(13, 185, 168, 0.614))",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          margin: "40px",
        }}
      >
        <h3 style={{ color: "black", marginBottom: "20px", fontSize: "25px" }}>
          {t("language settings")}
        </h3>
        <h5 style={{ fontSize: "17px", marginBottom: "10px" }}>
          {t("choose your language")}
        </h5>
        <select
          style={{ height: "30px", width: "90px", background: "black" }}
          onChange={(e) => changeLanguage(e.target.value)}
          value={i18n.language}
        >
          <option style={{ background: "gray" }} value="en">
            English
          </option>
          <option style={{ background: "gray" }} value="ar">
            العربية
          </option>
          <option style={{ background: "gray" }} value="es">
            Español
          </option>
          <option style={{ background: "gray" }} value="de">
            Deutsch
          </option>
          <option style={{ background: "gray" }} value="cn">
           chinese
          </option>
          <option style={{ background: "gray" }} value="fr">
           french
          </option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
