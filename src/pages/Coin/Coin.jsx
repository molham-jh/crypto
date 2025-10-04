import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Coin.css";
import ChartComponent from "./../../component/Chart/Chart";
import { useTranslation } from "react-i18next";

const Coin = () => {
  const { CoinID } = useParams();
  const { t } = useTranslation();
  const currency = "usd";

  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!CoinID) return;

    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const [cRes, hRes] = await Promise.all([
          fetch(`https://api.coingecko.com/api/v3/coins/${CoinID}`),
          fetch(
            `https://api.coingecko.com/api/v3/coins/${CoinID}/market_chart?vs_currency=${currency}&days=7`
          ),
        ]);
        if (!cRes.ok) throw new Error(t("fetch_coin_error"));
        if (!hRes.ok) throw new Error(t("fetch_history_error"));

        const [cJson, hJson] = await Promise.all([cRes.json(), hRes.json()]);
        setCoinData(cJson);
        setHistoricalData(hJson);
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [CoinID, t]);

  if (loading)
    return (
      <div className="coin">
        <p>{t("loading_coin_data")}</p>
      </div>
    );
  if (error)
    return (
      <div className="coin">
        <p className="error">{error}</p>
      </div>
    );
  if (!coinData) return null;

  return (
    <div className="coin">
      <div className="coin-header">
        {coinData.image?.large && (
          <img
            src={coinData.image.large}
            alt={coinData.name}
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
        <div className="coin-name">
          <h1>{coinData.name}</h1>
          <p>({coinData.symbol.toUpperCase()})</p>
        </div>
      </div>

      <div className="coin-chart">
        <ChartComponent historicalData={historicalData} />
      </div>

      <div className="coin-details">
        <div className="detail-card">
          <h3>{t("key_information")}</h3>
          <p>
            <b>{t("algorithm")}:</b> {coinData.hashing_algorithm || "N/A"}
          </p>
          <p>
            <b>{t("genesis_date")}:</b> {coinData.genesis_date || t("unknown")}
          </p>
          <p>
            <b>{t("change_24h")}:</b>{" "}
            <span
              className={
                coinData.market_data.price_change_percentage_24h > 0
                  ? "positive"
                  : "negative"
              }
            >
              {coinData.market_data.price_change_percentage_24h.toFixed(2)}%
            </span>
          </p>
        </div>

        <div className="detail-card">
          <h3>{t("market_data")}</h3>
          <p>
            <b>{t("all_time_high")}:</b> $
            {coinData.market_data.ath.usd.toLocaleString() || "N/A"}
          </p>
          <p>
            <b>{t("all_time_low")}:</b> $
            {coinData.market_data.atl.usd.toLocaleString() || "N/A"}
          </p>
          <p>
            <b>{t("current_price")}:</b> $
            {coinData.market_data.current_price.usd.toLocaleString() || "N/A"}
          </p>
        </div>

        <div className="detail-card">
          <h3>{t("links")}</h3>
          <p>
            <b>{t("homepage")}:</b>{" "}
            <a
              href={coinData.links.homepage[0]}
              target="_blank"
              rel="noreferrer"
            >
              {t("website")}
            </a>
          </p>
          <p>
            <b>{t("github")}:</b>{" "}
            <a
              href={coinData.links.repos_url.github[0]}
              target="_blank"
              rel="noreferrer"
            >
              {t("repository")}
            </a>
          </p>
        </div>
      </div>

      <div className="coin-description">
        <h3>{t("description")}</h3>
        <div
          dangerouslySetInnerHTML={{
            __html: coinData.description.en
              ? coinData.description.en.slice(0, 1000) + "…"
              : t("no_description"),
          }}
        />
      </div>
    </div>
  );
};

export default Coin;
