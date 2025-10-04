import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CoinContext } from "../../context/coincontext";
import Chat from "./../../component/Chat/Chat";

const Home = () => {
  const { allCoins, currency } = useContext(CoinContext);
  const { t } = useTranslation();
  const [displayCoins, setDisplayCoin] = useState([]);
  const [input, setInput] = useState("");
  const isWide = window.innerWidth > 700;

  useEffect(() => {
    setDisplayCoin(allCoins);
  }, [allCoins]);

  const inputHandler = (e) => {
    setInput(e.target.value);
    if (e.target.value === "") {
      setDisplayCoin(allCoins);
    }
  };

  const searchHandler = (e) => {
    e.preventDefault();
    const coins = allCoins.filter((item) =>
      item.name.toLowerCase().includes(input.toLowerCase())
    );
    setDisplayCoin(coins);
  };

  const styles = {
    container: {
      fontFamily: "Inter, Segoe UI, sans-serif",
      backgroundColor: "#0a0a12",
      color: "#f0f0f0",
      padding: "1rem",
      minHeight: "100vh",
    },
    hero: {
      textAlign: "center",
      marginBottom: "1.5rem",
    },
    heading: {
      fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
      fontWeight: "bold",
      background: "linear-gradient(90deg, #00f0ff, #ff00aa)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    form: {
      marginTop: "1rem",
    },
    input: {
      width: "100%",
      padding: "0.6rem",
      fontSize: "1rem",
      borderRadius: "6px",
      border: "1px solid #ccc",
      marginBottom: "0.75rem",
      color: "#000",
    },
    button: {
      width: "100%",
      padding: "0.6rem",
      fontSize: "1rem",
      backgroundColor: "#00f0ff",
      color: "#000",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    },
    tableHeader: {
      display: "grid",
      gridTemplateColumns: isWide ? "1fr 3fr 2fr 2fr 2fr" : "1fr 3fr 2fr 2fr",
      gap: "0.5rem",
      backgroundColor: "#1a1a2e",
      padding: "0.5rem",
      fontWeight: "bold",
      fontSize: isWide ? "1rem" : "0.8rem",
      overflow: "hidden",
      whiteSpace: "nowrap",
    },
    row: {
      display: "grid",
      gridTemplateColumns: isWide ? "1fr 3fr 2fr 2fr 2fr" : "1fr 3fr 2fr 2fr",
      gap: "0.5rem",
      alignItems: "center",
      padding: "0.5rem",
      borderBottom: "1px solid rgba(0,240,255,0.2)",
      textDecoration: "none",
      color: "#f0f0f0",
      fontSize: isWide ? "0.9rem" : "0.75rem",
      overflow: "hidden",
      whiteSpace: "nowrap",
    },
    icon: {
      width: "18px",
      height: "18px",
      marginRight: "0.3rem",
    },
    percent: (value) => ({
      color: value >= 0 ? "#00ff88" : "#ff00aa",
      fontWeight: "bold",
    }),
    invest: {
      textAlign: "center",
      marginTop: "2rem",
      padding: "1rem",
      backgroundColor: "#7b2cbf",
      borderRadius: "6px",
      color: "#fff",
      textDecoration: "none",
      fontSize: "1rem",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heading}>{t("welcoming")}</h1>
        <p>{t("home-info")}</p>
        <form onSubmit={searchHandler} style={styles.form}>
          <input
            value={input}
            onChange={inputHandler}
            list="coinList"
            type="text"
            placeholder={t("search")}
            style={styles.input}
          />
          <datalist id="coinList">
            {allCoins.map((item, index) => (
              <option key={index} value={item.name} />
            ))}
          </datalist>
          <button type="submit" style={styles.button}>
            {t("search")}
          </button>
        </form>
      </div>

      <div>
        <div style={styles.tableHeader}>
          <p>#</p>
          <p>{t("coins")}</p>
          <p>{t("price")}</p>
          <p>{t("24_change")}</p>
          {isWide && <p>{t("market_cap")}</p>}
        </div>

        {displayCoins.slice(0, 10).map((item, index) => {
          const percentageChange = item.market_cap
            ? (item.market_cap_change_24h / item.market_cap) * 100
            : 0;

          return (
            <Link to={`/Coin/${item.id}`} key={index} style={styles.row}>
              <p>{item.market_cap_rank}</p>
              <p>
                <img src={item.image} alt="icon" style={styles.icon} />
                {item.name} - {item.symbol.toUpperCase()}
              </p>
              <p>
                {currency.symbol} {item.current_price.toLocaleString()}
              </p>
              <p style={styles.percent(percentageChange)}>
                {percentageChange.toFixed(2)}%
              </p>
              {isWide && (
                <p>
                  {currency.symbol} {item.market_cap.toLocaleString()}
                </p>
              )}
            </Link>
          );
        })}
      </div>

<div className="" style={{display:"flex"}}>
      <Link
        to="/invest-in-crypto"
        style={{
          display: "inline-block",
          textAlign: "center",
          margin: "2rem auto", // لجعل العنصر في المنتصف
          padding: "0.75rem 1.5rem",
          backgroundColor: "#7b2cbf",
          borderRadius: "8px",
          color: "#fff",
          textDecoration: "none",
          fontSize: "1.1rem",
          fontWeight: "bold",
          transition: "background-color 0.3s ease, transform 0.2s ease",
          boxShadow: "0 4px 8px rgba(123, 44, 191, 0.3)",
        }}
      >
        <p>Start Investing</p>
      </Link>
      </div>

      <Chat />
    </div>
  );
};

export default Home;
