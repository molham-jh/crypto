import React, { useState, useEffect, useRef } from "react";
import "./SideBar.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Import icons (make sure paths are correct)
import account from './../assets/icons8-community-50.png';
import profile from './../assets/icons8-test-account-48.png';
import settings from './../assets/icons8-settings-64.png';
import logOut from './../assets/icons8-log-out-50.png';
import support from './../assets/icons8-support-94.png';
import Home from './../assets/icons8-home-50.png';

const SideBar = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Hamburger Toggle */}
      <div
        ref={hamburgerRef}
        className="hamburger"
        onClick={() => setVisible(!visible)}
        aria-label="Toggle Sidebar"
        title="Toggle Sidebar"
      >
        <div className={`line ${visible ? "line-1-active" : ""}`} />
        <div className={`line ${visible ? "line-2-active" : ""}`} />
        <div className={`line ${visible ? "line-3-active" : ""}`} />
      </div>

      {/* Sidebar */}
      <div 
        ref={sidebarRef} 
        className={`sidebar ${visible ? "visible" : "hidden"}`}
      >
        <div className="sidebar-header">
          <div className="glowing-logo"></div>
          <h2 className="sidebar-title">CRYPTO DASH</h2>
        </div>

        <div className="sidebar-items">
          <Link to='/' onClick={() => setVisible(false)}>
            <p className="sidebar-item">
              <img src={Home} alt="Home" className="sidebar-icon" />
              <span>{t('home')}</span>
              <div className="hover-glow"></div>
            </p>
          </Link>

          <Link to='/My-account' onClick={() => setVisible(false)}>
            <p className="sidebar-item">
              <img src={profile} alt="Profile" className="sidebar-icon" />
              <span>{t('profile')}</span>
              <div className="hover-glow"></div>
            </p>
          </Link>

          <Link to='/Settings' onClick={() => setVisible(false)}>
            <p className="sidebar-item">
              <img src={settings} alt="Settings" className="sidebar-icon" />
              <span>{t('settings')}</span>
              <div className="hover-glow"></div>
            </p>
          </Link>

          <Link to='/FakeSupport' onClick={() => setVisible(false)}>
            <p className="sidebar-item">
              <img src={support} alt="Support" className="sidebar-icon" />
              <span>{t('support')}</span>d
              <div className="hover-glow"></div>
            </p>
          </Link>

          <Link to='/Accounts' onClick={() => setVisible(false)}>
            <p className="sidebar-item">
              <img src={account} alt="Accounts" className="sidebar-icon" />
              <span>{t('accounts')}</span>
              <div className="hover-glow"></div>
            </p>
          </Link>

          <div className="divider"></div>

          <Link to='/logout' onClick={() => setVisible(false)}>
            <p className="sidebar-item logout">
              <img src={logOut} alt="Logout" className="sidebar-icon" />
              <span>{t('logout')}</span>
              <div className="hover-glow"></div>
            </p>
          </Link>
        </div>

        <div className="sidebar-footer">
          <div className="pulse-dot"></div>
          <span>Online</span>
        </div>
      </div>
    </>
  );
};

export default SideBar;