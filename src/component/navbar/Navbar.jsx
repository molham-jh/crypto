import React, { useContext, useState } from "react";
import "./Navbar.css";
import logo from "./../../assets/logo.png";
import arrow from "./../../assets/arrow_icon.png";
import { CoinContext } from "../../context/coincontext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { setCurrency } = useContext(CoinContext);
  const { t } = useTranslation();
  const [isSignedUp, setIsSignedUp] = useState(false);

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "usd":
        setCurrency({ name: "usd", symbol: "$" });
        break;
      case "eur":
        setCurrency({ name: "eur", symbol: "€" });
        break;
      case "inr":
        setCurrency({ name: "inr", symbol: "₹" });
        break;
      default:
        setCurrency({ name: "usd", symbol: "$" });
    }
  };

  const handleSignUpClick = () => {
    setIsSignedUp(true);
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={logo} alt="logo" className="logo" />
      </Link>

      {/* Optional nav links can go here */}
      <ul></ul>

      <div className="nav-right">
        <select onChange={currencyHandler}>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="inr">INR</option>
        </select>

        {!isSignedUp && (
          <Link to="/login-form">
            <button onClick={handleSignUpClick}>
              {t("sign up")} <img src={arrow} alt="arrow icon" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
