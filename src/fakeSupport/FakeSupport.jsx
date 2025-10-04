import React from 'react';
import { FiMail, FiMessageSquare, FiHelpCircle, FiPhone } from 'react-icons/fi';
import './fakeSupport.css'; // Create this CSS file for styling
import { useTranslation } from 'react-i18next';
const Support = () => {
  const {t} = useTranslation()
  return (
    <div className="support-container">
        <h1 className='fake'>{t('fake')}</h1>
      <h2 className="support-title">{t('Were Here to Help')}</h2>
      <p className="support-subtitle">{t("Contact our support team through any of these channels")}</p>
      
      <div className="support-options">
        <div className="support-card">
          <div className="support-icon">
            <FiMail size={24} />
          </div>
          <h3>{t('Email Support')}</h3>
          <p>{t("Get help via email with our dedicated support team")}</p>
          <a href="mailto:support@example.com" className="support-link">
            support@example.com
          </a>
        </div>
        
        <div className="support-card">
          <div className="support-icon">
            <FiMessageSquare size={24} />
          </div>
          <h3>{t("Live Chat")}</h3>
          <p>{t("Chat with a support agent in real-time")}</p>
          <button className="support-button">
            {t("Start Chat")}
          </button>
        </div>
        
        <div className="support-card">
          <div className="support-icon">
            <FiHelpCircle size={24} />
          </div>
          <h3>Help Center</h3>
          <p>{t("Find answers in our comprehensive knowledge base")}</p>
          <button className="support-button">
            {t("Browse Articles")}
          </button>
        </div>
        
        <div className="support-card">
          <div className="support-icon">
            <FiPhone size={24} />
          </div>
          <h3>{t("Phone Support")}</h3>
          <p>{t("Call us during business hours")}</p>
          <a href="tel:+1234567890" className="support-link">
            +1 (234) 567-890
          </a>
        </div>
      </div>
    </div>
  );
};

export default Support;