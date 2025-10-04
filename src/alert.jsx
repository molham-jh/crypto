import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FakeAlertPage = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Create a pulsing effect every 2 seconds
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        fontFamily: '"Segoe UI", Roboto, sans-serif',
      }}
    >
      <motion.div
        animate={{
          scale: pulse ? [1, 1.02, 1] : 1,
          boxShadow: pulse 
            ? ['0 0 0 0px rgba(255, 71, 87, 0.4)', '0 0 0 10px rgba(255, 71, 87, 0)', '0 0 0 0px rgba(255, 71, 87, 0)']
            : '0 5px 20px rgba(255, 71, 87, 0.3)'
        }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '10px',
          background: 'linear-gradient(90deg, #ff4757, #ff6b81, #ff4757)',
        }} />
        
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 71, 87, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ fontSize: '24px' }}
          >
            ⚠️
          </motion.div>
        </div>

        {/* Main content */}
        <h2 style={{
          color: '#ff4757',
          fontSize: '28px',
          fontWeight: '600',
          marginBottom: '15px',
          marginTop: '10px',
        }}>
          Security Warning
        </h2>
        
        <p style={{
          color: '#555',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '25px',
        }}>
          This is a demonstration page only. Not a real service or website.
        </p>
        
        <p style={{
          color: '#777',
          fontSize: '14px',
          lineHeight: '1.5',
          marginBottom: '30px',
          backgroundColor: '#f9f9f9',
          padding: '15px',
          borderRadius: '8px',
          borderLeft: '4px solid #ff4757',
        }}>
          Do not enter any personal or sensitive information. This page is for educational purposes only.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsVisible(false)}
          style={{
            backgroundColor: '#ff4757',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(255, 71, 87, 0.2)',
            outline: 'none',
            transition: 'all 0.2s',
          }}
        >
          I Understand
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default FakeAlertPage;