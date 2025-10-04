import React, { createContext, useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Login.css";

export const FormContext = createContext();
export const useForm = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("userFormData");
    return saved
      ? JSON.parse(saved)
      : {
          name: "",
          email: "",
          password: "",
          job: "",
          age: "",
          agree: false,
          image: "",
          description: "",
        };
  });

  useEffect(() => {
    localStorage.setItem("userFormData", JSON.stringify(form));
  }, [form]);

  return (
    <FormContext.Provider value={{ form, setForm }}>
      {children}
    </FormContext.Provider>
  );
};

const SignupForm = () => {
  const { form, setForm } = useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "image" && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.agree) {
      Swal.fire({
        icon: "warning",
        title: t("please_accept_terms"),
      });
      return;
    }

    const confirmationCode = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("confirmationCode", confirmationCode);
    localStorage.setItem("userEmail", form.email);

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const newUser = {
      id: users.length + 1,
      name: form.name,
      email: form.email,
      password: form.password,
      job: form.job,
      age: form.age,
      image: form.image,
      description: form.description,
    };

    localStorage.setItem("users", JSON.stringify([...users, newUser]));

    emailjs
      .send(
        "service_b9cmf0p",
        "template_a5fucz7",
        {
          from_name: "Signup Form",
          to_name: form.name,
          to_email: form.email,
          confirmation_code: confirmationCode,
          message: `Hello ${form.name}, and a warm welcome to our family! 💖 Your confirmation code is: ${confirmationCode}. We’re so excited you’re here!`
,
          reply_to: form.email,
        },
        "4VO2dOevEHxACkWkC"
      )
      .then(() => {
        Swal.fire({
          title: t("check_email"),
          text: t("confirmation_sent", { email: form.email }),
          icon: "info",
        });
        navigate("/profile");
      })
      .catch((error) => {
        Swal.fire({
          title: t("error_occurred"),
          text: t("email_failed"),
          icon: "error",
        });
        console.error("EmailJS error:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="formela" encType="multipart/form-data">
      <label>
        {t("name")}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="loginInputs"
          required
        />
      </label>

      <label>
        {t("email")}
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="loginInputs"
          required
        />
      </label>

      <label>
        {t("password")}
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="loginInputs"
          required
          minLength={6}
        />
      </label>

      <label>
        {t("job")}
        <input
          name="job"
          value={form.job}
          onChange={handleChange}
          className="loginInputs"
        />
      </label>

      <label>
        {t("age")}
        <input
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          className="loginInputs"
        />
      </label>

      <label>
        {t("description")}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="loginInputs"
          rows={3}
        />
      </label>

      <label>
        {t("profile_image")}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="loginInputs"
        />
      </label>

      <label>
        <input
          type="checkbox"
          name="agree"
          checked={form.agree}
          onChange={handleChange}
          required
        />
        {t("agree_terms")}
      </label>

      <Link to="/login-form/confirm">
        <button className="button" type="submit" disabled={!form.agree}>
          {t("create_account")}
        </button>
      </Link>
    </form>
  );
};

export default SignupForm;
