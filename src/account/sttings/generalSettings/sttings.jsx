import React from "react";
import UserLocation from "./../Location/lacation";
import LanguageSwitcher from "../languages/LangSwitcher";
import { Link } from "react-router-dom";
import './settings.css'
import { useTranslation } from "react-i18next";
import Mood from "../mood/mood";
const Setting = () => {
  const {t} = useTranslation()
  return (
    <div className="settings-container" style={{display:'flex'}}>
      <UserLocation />
      <LanguageSwitcher/>
      <Mood/>
      
      <div className="edit">
        <Link to='/setting/editProfile'>
        <h3>{t("change your profile info")}</h3>
        </Link>
      </div>
      
    </div>
  );
};

export default Setting;
