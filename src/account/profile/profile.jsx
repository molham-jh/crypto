import React, { useState } from "react";
import { useForm } from "../../component/loginForm/Login";
import "./profile.css";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { form, setForm } = useForm();
  const { t } = useTranslation();

  const [descInput, setDescInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescChange = (e) => {
    setDescInput(e.target.value);
  };

  const handleDescSubmit = (e) => {
    e.preventDefault();
    if (descInput.trim()) {
      setForm((prev) => ({
        ...prev,
        description: descInput.trim(),
      }));
      setDescInput("");
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="profile-container" style={{ maxWidth: 400, margin: "auto" }}>
      <div
        style={{
          width: "200px",
          height: 200,
          border: "2px dashed #ccc",
          borderRadius: "50%",
          overflow: "hidden",
          margin: "20px auto",
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          backgroundImage: form.image ? `url(${form.image})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!form.image && (
          <p style={{ paddingTop: 80, color: "#999" }}>
            Drop image here or upload
          </p>
        )}
      </div>

      {!form.image && (
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{
            display: "block",
            margin: "10px auto 30px",
            cursor: "pointer",
            fontSize: 14,
            color: "#555",
          }}
        />
      )}

      {/* Description Section */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        {form.description ? (
          <p
            style={{
              backgroundColor: "#f0f0f0",
              padding: "10px 15px",
              borderRadius: 8,
              fontStyle: "italic",
              color: "#555",
              whiteSpace: "pre-wrap",
              marginTop: 10,
            }}
          >
            {form.description}
          </p>
        ) : (
          <form onSubmit={handleDescSubmit}>
            <textarea
              placeholder="Add your description about yourself here..."
              value={descInput}
              onChange={handleDescChange}
              rows={3}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                resize: "vertical",
                fontSize: 14,
              }}
              required
            />
            <button
              type="submit"
              style={{
                marginTop: 8,
                padding: "6px 15px",
                borderRadius: 6,
                border: "none",
                backgroundColor: "#4a90e2",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              Save Description
            </button>
          </form>
        )}
      </div>

      {/* Profile Info */}
      <div
        className="profile-form"
        style={{ marginTop: 20, lineHeight: 1.6, fontSize: 16, color: "#333" }}
      >
        <h2>
          {t("Welcome, ")}
          {form.name || "User"}
        </h2>
        <p>
          <strong>{t("Email: ")}</strong> {form.email || "-"}
        </p>
        <p>
          <strong>{t("Job: ")}</strong> {form.job || "-"}
        </p>
        <p>
          <strong>{t("Age: ")}</strong> {form.age || "-"}
        </p>
        <p style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <strong>{t("Password: ")}</strong>
          <span>{showPassword ? form.password : form.password.replace(/./g, "•")}</span>
          <span
            onClick={togglePassword}
            style={{
              cursor: "pointer",
              animation: "crazy-eye 1s infinite",
              display: "inline-block",
              fontSize: 18,
              color: "white",
              userSelect: "none",
            }}
          >
            👁️
          </span>
        </p>
      </div>
    </div>
  );
};

export default Profile;
