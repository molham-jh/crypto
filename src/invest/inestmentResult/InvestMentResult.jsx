import React, { useEffect, useState } from "react";
import './invstmentresult.css';
const LOCAL_STORAGE_KEY = "cryptoPortfolio";

const COINS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "binancecoin", name: "Binance Coin", symbol: "BNB" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "ripple", name: "XRP", symbol: "XRP" },
];

const InvestmentSummary = () => {
  const [portfolio, setPortfolio] = useState({});
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) setPortfolio(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = COINS.map((c) => c.id).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );
        const data = await res.json();
        setPrices(data);
      } catch (err) {
        console.error("Error fetching prices:", err);
      }
    };
    fetchPrices();
  }, []);

  const coins = Object.entries(portfolio);
  const totalInvested = coins.reduce((sum, [, data]) => sum + data.invested, 0);
  const totalCurrentValue = coins.reduce((sum, [coinId, data]) => {
    const currentPrice = prices[coinId]?.usd || 0;
    return sum + data.qty * currentPrice;
  }, 0);
  const profitLossAmount = totalCurrentValue - totalInvested;
  const profitLossPercent = totalInvested
    ? (profitLossAmount / totalInvested) * 100
    : 0;

  return (
    <div className="wrapper">
      <div className="box">
        <h1 className="title">📊 Investment Summary</h1>

        {coins.length === 0 ? (
          <p>You have no investments yet.</p>
        ) : (
          <div className="cards-container">
            {coins.map(([coinId, data]) => {
              const currentPrice = prices[coinId]?.usd || 0;
              const currentValue = data.qty * currentPrice;
              return (
                <div key={coinId} className="coin-card">
                  <h3>{coinId.toUpperCase()}</h3>
                  <p><strong>Invested:</strong> ${data.invested.toFixed(2)}</p>
                  <p><strong>Quantity:</strong> {data.qty.toFixed(6)}</p>
                  <p><strong>First Price:</strong> ${data.firstPrice.toFixed(2)}</p>
                  <p><strong>Current Price:</strong> ${currentPrice.toFixed(2)}</p>
                  <p><strong>Current Value:</strong> ${currentValue.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        )}

        {coins.length > 0 && (
          <div className="summary">
            <p><strong>Total Invested:</strong> ${totalInvested.toFixed(2)}</p>
            <p><strong>Current Portfolio Value:</strong> ${totalCurrentValue.toFixed(2)}</p>
            <p
              style={{
                color: profitLossAmount >= 0 ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              <strong>
                {profitLossAmount >= 0 ? "Profit" : "Loss"}: ${profitLossAmount.toFixed(2)} ({profitLossPercent.toFixed(2)}%)
              </strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentSummary;
