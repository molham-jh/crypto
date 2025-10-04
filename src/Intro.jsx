import React, { useEffect, useState } from "react";

const messages = ["Welcome...", "To the future...", "Of crypto investing..."];

const AnimatedIntro = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 6000; // faster experience
    const tick = 100;

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / (totalDuration / tick), 100));
    }, tick);

    const timer = setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, totalDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.effects} />
      <div style={styles.content}>
        {messages.map((msg, i) => (
          <h1 key={i} style={{ ...styles.text, animationDelay: `${i * 1000}ms` }}>
            {msg}
            {i === messages.length - 1 && <span style={styles.cursor}>_</span>}
          </h1>
        ))}
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <p style={styles.footer}>SECURE CONNECTION ESTABLISHED</p>
      </div>
      <style>{keyframes}</style>
    </div>
  );
};

const styles = {
  wrapper: {
    position: "fixed",
    inset: 0,
    background: "radial-gradient(ellipse at center, #0a0a0a 0%, #121212 100%)",
    color: "#00ffe7",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Share Tech Mono', monospace",
    zIndex: 10000,
    overflow: "hidden",
  },
  effects: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(#00ffe733 1px, transparent 1px), linear-gradient(90deg, #00ffe733 1px, transparent 1px)",
    backgroundSize: "20px 20px",
    animation: "gridPulse 4s ease-in-out infinite", // faster pulse
    zIndex: 1,
    pointerEvents: "none",
  },
  content: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    padding: "0 30px",
  },
  text: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    margin: "1em 0",
    opacity: 0,
    animation: "fadeIn 1s ease-out forwards",
    textShadow: "0 0 12px #00ffe7",
    letterSpacing: "0.15em",
  },
  cursor: {
    animation: "blink 0.8s step-end infinite", // slightly faster blink
    marginLeft: "5px",
  },
  progressTrack: {
    width: "65%",
    height: "3px",
    margin: "2em auto",
    backgroundColor: "rgba(0,255,231,0.2)",
    borderRadius: "2px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#00ffe7",
    transition: "width 0.1s linear",
    boxShadow: "0 0 8px #00ffe7",
  },
  footer: {
    fontSize: "0.9rem",
    color: "rgba(0,255,231,0.6)",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    animation: "flicker 2.2s infinite alternate", // faster flicker
  },
};

const keyframes = `
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(2px); }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
@keyframes blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
@keyframes gridPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.02); }
}
@keyframes flicker {
  0%, 20%, 22%, 24%, 54%, 56%, 100% {
    opacity: 0.6;
    text-shadow: 0 0 6px rgba(0,255,231,0.4);
  }
  21%, 23%, 55% {
    opacity: 0.3;
    text-shadow: none;
  }
}
`;

export default AnimatedIntro;
