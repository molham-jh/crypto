import React, { useState } from "react";
import { useForm } from "../../../component/loginForm/Login";
import "./editProfile.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { form, setForm } = useForm();
  const [editedData, setEditedData] = useState(form);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm(editedData);
    alert("Profile updated successfully!");
    navigate("/");
  };

  return (
    <div className="profileContainer">
      <h1>{t("Account Settings")}</h1>
      <div className="settingsForm">
        <form onSubmit={handleSubmit}>
          {/* Profile Section */}
          <div className="settingsSection">
            <h2>
              <i className="fas fa-user-cog"></i> {t("Profile Information")}
            </h2>

            <div className="formGroup">
              <label htmlFor="name">{t("Full Name")}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedData.name || ""}
                onChange={handleChange}
                placeholder={t("Enter your full name")}
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="email">{t("Email Address")}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editedData.email || ""}
                onChange={handleChange}
                placeholder={t("Enter your email")}
                required
              />
            </div>
          </div>

          {/* Professional Section */}
          <div className="settingsSection">
            <h2>
              <i className="fas fa-briefcase"></i> {t("Professional Details")}
            </h2>

            <div className="formGroup">
              <label htmlFor="job">{t("Occupation")}</label>
              <input
                type="text"
                id="job"
                name="job"
                value={editedData.job || ""}
                onChange={handleChange}
                placeholder={t("Enter your profession")}
              />
            </div>

            <div className="formGroup">
              <label htmlFor="age">{t("Age")}</label>
              <input
                type="number"
                id="age"
                name="age"
                value={editedData.age || ""}
                onChange={handleChange}
                min="18"
                max="100"
                placeholder={t("Your age")}
              />
            </div>
          </div>

          {/* Security Section */}
          <div className="settingsSection">
            <h2>
              <i className="fas fa-lock"></i> {t("Security")}
            </h2>

            {/* Password */}
            <div className="formGroup" style={{ position: "relative" }}>
              <label htmlFor="password">{t("Password")}</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={editedData.password || ""}
                onChange={handleChange}
                placeholder={t("Enter new password")}
                required
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={togglePassword}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "12px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#ccc",
                }}
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
              </span>
            </div>

            {/* Confirm Password */}
            <div className="formGroup" style={{ position: "relative" }}>
              <label htmlFor="confirmPassword">{t("Confirm Password")}</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={editedData.confirmPassword || ""}
                onChange={handleChange}
                placeholder={t("Re-enter your password")}
                required
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={toggleConfirmPassword}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "12px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#ccc",
                }}
              >
                <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} />
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="formActions">
            <button type="submit" className="saveButton">
              {t("Save Changes")}
            </button>
            <button
              type="button"
              className="cancelButton"
              onClick={() => navigate("/")}
            >
              {t("Cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
