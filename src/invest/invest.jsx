import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useNavigate, Link } from "react-router-dom";
import {useTranslation} from 'react-i18next'
const COINS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "binancecoin", name: "Binance Coin", symbol: "BNB" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "ripple", name: "XRP", symbol: "XRP" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
  { id: "litecoin", name: "Litecoin", symbol: "LTC" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK" },
];
const LOCAL_STORAGE_KEY = "cryptoPortfolio";
const CREDIT_CARD_SUBMITTED_KEY = "hasSubmittedCreditCard";

const Invest = () => {
  const [prices, setPrices] = useState({});
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [amountUSD, setAmountUSD] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {t} = useTranslation();


  const hasSubmittedCreditCard =
    localStorage.getItem(CREDIT_CARD_SUBMITTED_KEY) === "true";

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const ids = COINS.map((c) => c.id).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );
        const data = await res.json();
        setPrices(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching prices:", err);
        setLoading(false);
        Swal.fire({
          title: "Market Data Error",
          text: "Failed to load cryptocurrency prices. Please try again later.",
          icon: "error",
          confirmButtonColor: "#d33",
          customClass: {
            popup: 'animated shake'
          }
        });
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Process investment transaction
  const processInvestment = (usdAmount) => {
    const coin = COINS.find((c) => c.id === selectedCoin);
    const price = prices[selectedCoin]?.usd;

    if (!coin || !price) {
      Swal.fire({
        title: "Invalid Coin",
        text: "Please select a valid cryptocurrency.",
        icon: "error",
        confirmButtonColor: "#d33",
        customClass: {
          popup: 'animated shake'
        }
      });
      return;
    }

    const cryptoQty = usdAmount / price;

    let portfolio = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};

    const prevData = portfolio[coin.id] || {
      qty: 0,
      invested: 0,
      firstPrice: price,
    };
    
    portfolio[coin.id] = {
      qty: prevData.qty + cryptoQty,
      invested: prevData.invested + usdAmount,
      firstPrice: prevData.firstPrice,
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(portfolio));
    setAmountUSD("");

    return { coin, cryptoQty, usdAmount };
  };

  const handleInvest = (multiplier = 1) => {
    if (!hasSubmittedCreditCard) {
      Swal.fire({
        title: "Credit Card Required",
        text: "You need to submit your credit card information before investing.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Go to Credit Card Form",
        cancelButtonText: "Cancel",
        customClass: {
          popup: 'animated pulse'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/creditcardinfo");
        }
      });
      return;
    }

    let usd = parseFloat(amountUSD);
    
    // Validate input
    if (isNaN(usd) || usd <= 0) {
      Swal.fire({
        title: "Invalid Amount",
        text: "Please enter a valid investment amount greater than 0.",
        icon: "error",
        confirmButtonColor: "#d33",
        customClass: {
          popup: 'animated shake'
        }
      });
      return;
    }

    // Apply multiplier for 100x
    const is100x = multiplier === 100;
    const originalAmount = usd;
    
    if (is100x) {
      usd *= 100;
      
      // Confirm large investment
      Swal.fire({
        title: "Confirm 100x Investment",
        html: `You are about to invest <b>$${(originalAmount * 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</b><br>
               This is 100 times your entered amount of <b>$${originalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</b>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, invest 100x!",
        cancelButtonText: "Cancel",
        customClass: {
          popup: 'animated pulse'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const investmentResult = processInvestment(usd);
          if (investmentResult) {
            showSuccess(investmentResult, true);
          }
        }
      });
      return;
    }

    // Regular investment
    const investmentResult = processInvestment(usd);
    if (investmentResult) {
      showSuccess(investmentResult, false);
    }
  };

  // Show success message after investment
  const showSuccess = (investmentResult, is100x) => {
    const { coin, cryptoQty, usdAmount } = investmentResult;
    
    Swal.fire({
      title: is100x ? "Mega Investment Success!" : "Investment Success!",
      html: `You've invested <b>$${usdAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</b> in ${coin.name}.<br>
             You now own <b>${cryptoQty.toFixed(6)} ${coin.symbol}</b>`,
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
      customClass: {
        popup: is100x ? 'animated heartBeat' : 'animated tada',
        title: is100x ? 'mega-invest-title' : ''
      }
    });
  };

  // Handle 100x button click
  const handle100xClick = () => {
    if (!amountUSD || isNaN(parseFloat(amountUSD))) {
      Swal.fire({
        title: "Enter Amount First",
        text: "Please enter an investment amount before using the 100x feature.",
        icon: "info",
        confirmButtonColor: "#3085d6",
        customClass: {
          popup: 'animated pulse'
        }
      });
      return;
    }
    
    handleInvest(100);
  };

  // Inline styles
  const styles = {
    investContainer: {
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: '#fff',
      overflow: 'hidden',
    },
    cryptoBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: 0,
    },
    cryptoParticle: {
      position: 'absolute',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      animation: 'float 15s infinite linear',
    },
    investCard: {
      position: 'relative',
      zIndex: 1,
      background: 'rgba(26, 26, 46, 0.9)',
      borderRadius: '20px',
      padding: '30px',
      width: '100%',
      maxWidth: '600px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
    },
    cardHeader: {
      textAlign: 'center',
      marginBottom: '25px',
    },
    investTitle: {
      fontSize: '2.2rem',
      marginBottom: '15px',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    rocket: {
      fontSize: '2rem',
    },
    marketStatus: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      fontSize: '0.9rem',
      color: '#aaa',
    },
    marketIndicator: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#4caf50',
    },
    pulse: {
      animation: 'pulse 1.5s infinite',
    },
    formGroup: {
      marginBottom: '20px',
    },
    formLabel: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
    },
    selectWrapper: {
      position: 'relative',
    },
    formSelect: {
      width: '100%',
      padding: '12px 15px',
      background: '#1e1e3a',
      border: '1px solid #2d2d4a',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '1rem',
      appearance: 'none',
    },
    selectIcon: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
    },
    inputWithIcon: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
    },
    currencyIcon: {
      position: 'absolute',
      left: '15px',
      fontSize: '1.2rem',
      color: '#aaa',
    },
    formInput: {
      width: '100%',
      padding: '12px 15px 12px 40px',
      background: '#1e1e3a',
      border: '1px solid #2d2d4a',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '1rem',
    },
    multiplierButton: {
      position: 'absolute',
      right: '10px',
      background: 'linear-gradient(135deg, #ff9a00, #ff0080)',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '4px',
      color: '#fff',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    multiplierButtonDisabled: {
      background: 'linear-gradient(135deg, #666, #444)',
      cursor: 'not-allowed',
      opacity: 0.5,
    },
    inputHint: {
      fontSize: '0.85rem',
      color: '#aaa',
      marginTop: '5px',
    },
    investmentPreview: {
      marginTop: '20px',
    },
    previewContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
    },
    previewCard: {
      flex: 1,
      minWidth: '250px',
      background: '#1a1a2e',
      padding: '15px',
      borderRadius: '10px',
      border: '1px solid #2d2d4a',
    },
    megaPreview: {
      border: '2px solid #ff9a00',
      background: '#2a1a2e',
      position: 'relative',
      overflow: 'hidden',
    },
    previewCoin: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px',
    },
    coinIcon: {
      background: 'rgba(255, 255, 255, 0.1)',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '1.2rem',
    },
    previewAmount: {
      fontSize: '0.95rem',
    },
    highlight: {
      color: '#4caf50',
      fontWeight: 'bold',
    },
    investButtons: {
      display: 'flex',
      gap: '15px',
      marginTop: '20px',
    },
    investButton: {
      flex: 1,
      padding: '15px 20px',
      background: 'linear-gradient(135deg, #2196f3, #0d47a1)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'all 0.3s',
    },
    invest100xButton: {
      background: 'linear-gradient(135deg, #ff9a00, #ff0080)',
    },
    disabledButton: {
      background: 'linear-gradient(135deg, #666, #444)',
      cursor: 'not-allowed',
      opacity: 0.7,
    },
    buttonText: {
      flex: 1,
      textAlign: 'center',
    },
    portfolioLink: {
      marginTop: '25px',
      textAlign: 'center',
    },
    portfolioButton: {
      display: 'inline-block',
      padding: '10px 20px',
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
      textDecoration: 'none',
      borderRadius: '8px',
      transition: 'all 0.3s',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    cryptoTicker: {
      position: 'fixed',
      bottom: '0',
      left: '0',
      width: '100%',
      background: 'rgba(26, 26, 46, 0.9)',
      padding: '10px 0',
      display: 'flex',
      justifyContent: 'space-around',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      zIndex: 10,
      overflowX: 'auto',
    },
    tickerItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '0 15px',
    },
    tickerCoin: {
      fontWeight: 'bold',
      color: '#4caf50',
    },
    tickerPrice: {
      fontSize: '0.9rem',
    },
    animated: {
      animationDuration: '1s',
      animationFillMode: 'both',
    },
    fadeInUp: {
      animationName: 'fadeInUp',
    },
    fadeIn: {
      animationName: 'fadeIn',
    },
    shake: {
      animationName: 'shake',
    },
    tada: {
      animationName: 'tada',
    },
    heartBeat: {
      animationName: 'heartBeat',
    },
    pulse: {
      animationName: 'pulse',
    }
  };

  // Generate particles with random positions
  const particles = Array.from({ length: 15 }, (_, i) => {
    const size = Math.random() * 10 + 5;
    return (
      <div 
        key={i} 
        style={{
          ...styles.cryptoParticle,
          width: `${size}px`,
          height: `${size}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 10 + 15}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    );
  });

  return (
    <div style={styles.investContainer}>
      <div style={styles.cryptoBackground}>
        {particles}
      </div>
      
      <div style={{ ...styles.investCard, ...styles.animated, ...styles.fadeInUp }}>
        <div style={styles.cardHeader}>
          <h1 style={styles.investTitle}>
            <span style={styles.rocket}>🚀</span> {t('Crypto Investment Platform')}
          </h1>
          <div style={styles.marketStatus}>
            <div style={{ 
              ...styles.marketIndicator, 
              ...(loading ? styles.pulse : {}) 
            }} />
            <span>{loading ? "Loading market data..." : "Live Market Data"}</span>
          </div>
        </div>

        <div style={styles.investForm}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>{t('Select Currency')}:</label>
            <div style={styles.selectWrapper}>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                style={styles.formSelect}
              >
                {COINS.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol}) — $
                    {prices[coin.id]?.usd?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || "..."}
                  </option>
                ))}
              </select>
              <div style={styles.selectIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>{t('Amount in USD')}:</label>
            <div style={styles.inputWithIcon}>
              <span style={styles.currencyIcon}>$</span>
              <input
                type="number"
                value={amountUSD}
                onChange={(e) => setAmountUSD(e.target.value)}
                style={styles.formInput}
                placeholder="Enter investment amount"
                min="0"
                step="0.01"
              />
              <button 
                style={{
                  ...styles.multiplierButton,
                  ...(loading || !amountUSD ? styles.multiplierButtonDisabled : {})
                }}
                onClick={handle100xClick}
                title="Invest 100 times this amount"
                disabled={loading || !amountUSD}
              >
                100x
              </button>
            </div>
            <div style={styles.inputHint}>
              {t('Click 100x to multiply your investment')}
            </div>
          </div>

          <div style={styles.investmentPreview}>
            {!loading && prices[selectedCoin]?.usd && amountUSD && !isNaN(parseFloat(amountUSD)) && (
              <div style={styles.previewContainer}>
                <div style={{ ...styles.previewCard, ...styles.animated, ...styles.fadeIn }}>
                  <div style={styles.previewCoin}>
                    <div style={styles.coinIcon}>{COINS.find(c => c.id === selectedCoin)?.symbol}</div>
                    <span>{COINS.find(c => c.id === selectedCoin)?.name}</span>
                  </div>
                  <div style={styles.previewAmount}>
                    {t('You will receive')}: <span style={styles.highlight}>{(parseFloat(amountUSD) / prices[selectedCoin].usd).toFixed(6)}</span>
                  </div>
                </div>
                
                <div style={{ ...styles.previewCard, ...styles.megaPreview, ...styles.animated, ...styles.fadeIn }}>
                  <div style={styles.previewCoin}>
                    <div style={styles.coinIcon}>100x</div>
                    <span>{t('Mega Investment')}</span>
                  </div>
                  <div style={styles.previewAmount}>
                    100x Amount: <span style={styles.highlight}>${(parseFloat(amountUSD) * 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  <div style={styles.previewAmount}>
                    {t('You would receive')}: <span style={styles.highlight}>{(parseFloat(amountUSD) * 100 / prices[selectedCoin].usd).toFixed(6)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={styles.investButtons}>
            <button 
              onClick={() => handleInvest(1)} 
              style={{
                ...styles.investButton,
                ...(loading ? styles.disabledButton : {})
              }}
              disabled={loading}
            >
              {loading ? (
                <span style={styles.buttonText}>Loading Market Data...</span>
              ) : (
                <>
                  <span style={styles.buttonText}>Invest Now</span>
                  <span>💸</span>
                </>
              )}
            </button>
            
            <button 
              onClick={handle100xClick}
              style={{
                ...styles.investButton,
                ...styles.invest100xButton,
                ...(loading || !amountUSD ? styles.disabledButton : {})
              }}
              disabled={loading || !amountUSD}
            >
              <span style={styles.buttonText}>Invest 100x</span>
              <span>🚀</span>
            </button>
          </div>
        </div>

        <div style={styles.portfolioLink}>
          <Link to="/investment-info" style={styles.portfolioButton}>
            <span>📈</span> {t('View My Portfolio')}
          </Link>
        </div>
      </div>
      
      <div style={styles.cryptoTicker}>
        {COINS.map(coin => (
          <div style={styles.tickerItem} key={coin.id}>
            <div style={styles.tickerCoin}>{coin.symbol}</div>
            <div style={styles.tickerPrice}>
              {loading ? '...' : `$${prices[coin.id]?.usd?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          @keyframes tada {
            0% { transform: scale(1); }
            10%, 20% { transform: scale(0.9) rotate(-3deg); }
            30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
            40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
            100% { transform: scale(1) rotate(0); }
          }
          
          @keyframes heartBeat {
            0% { transform: scale(1); }
            14% { transform: scale(1.2); }
            28% { transform: scale(1); }
            42% { transform: scale(1.2); }
            70% { transform: scale(1); }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(20px, -20px) rotate(90deg); }
            50% { transform: translate(40px, 20px) rotate(180deg); }
            75% { transform: translate(-20px, 40px) rotate(270deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
          }
          
          .animated {
            animation-duration: 1s;
            animation-fill-mode: both;
          }
          
          .mega-invest-title {
            color: #ff9a00 !important;
            text-shadow: 0 0 10px rgba(255, 154, 0, 0.5);
          }
        `}
      </style>
    </div>
  );
};

export default Invest;