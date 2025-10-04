import React, { useEffect, useState, useRef } from "react";
import "./logout.css";

const DestructionNotice = () => {
  const [daysLeft, setDaysLeft] = useState(7);
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showSubMessage, setShowSubMessage] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Calculate remaining days with error handling
    try {
      const stored = localStorage.getItem("siteCreatedAt");
      let createdAt;

      if (!stored) {
        createdAt = Date.now();
        localStorage.setItem("siteCreatedAt", createdAt.toString());
      } else {
        createdAt = parseInt(stored, 10);
        if (isNaN(createdAt)) {
          throw new Error("Invalid date format in localStorage");
        }
      }

      const now = Date.now();
      const diff = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
      const remaining = Math.max(0, 7 - diff);
      setDaysLeft(remaining);
    } catch (error) {
      console.error("Error calculating days left:", error);
      setDaysLeft(7); // Fallback to default
    }
  }, []);

  useEffect(() => {
    // Full message with proper Arabic character handling
    const fullMessage = `i am a front end devolober and i can not do this anyway this website will be deleted in⚠️ ${daysLeft} day your data fake and safe${daysLeft !== 1 ? "ًا" : ""}.`;
    
    // Reset state for new message
    setTypedText("");
    setCurrentIndex(0);
    setIsComplete(false);
    setShowSubMessage(false);
    
    let interval;
    const startDelay = setTimeout(() => {
      interval = setInterval(() => {
        setTypedText(prev => {
          if (prev.length >= fullMessage.length) {
            clearInterval(interval);
            setIsComplete(true);
            setTimeout(() => setShowSubMessage(true), 800);
            return prev;
          }
          return fullMessage.slice(0, prev.length + 1);
        });
      }, Math.random() * 50 + 50); // Variable typing speed for more natural feel
    }, 800); // Slightly longer initial delay
    
    return () => {
      clearTimeout(startDelay);
      clearInterval(interval);
    };
  }, [daysLeft]);

  return (
    <div className="destruction-container" ref={containerRef}>
      <div className="terminal">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <div className="terminal-button close"></div>
            <div className="terminal-button minimize"></div>
            <div className="terminal-button expand"></div>
          </div>
          <div className="terminal-title">terminal</div>
        </div>
        <div className="terminal-body">
          <div className="destruction-notice">
            <div className="typewriter">
              <p className="glitch-text">
                {typedText.split('').map((char, index) => (
                  <span 
                    key={index} 
                    className={`char ${index === typedText.length - 1 ? 'last-char' : ''}`}
                    style={{
                      animationDelay: `${index * 0.03}s`,
                      color: char === '⚠️' ? '#ff5555' : 'inherit'
                    }}
                  >
                    {char}
                  </span>
                ))}
                {!isComplete && <span className="cursor blink"></span>}
              </p>
            </div>
            <p className={`sub-message ${showSubMessage ? 'visible' : ''}`}>
              dont worry you info is safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestructionNotice;