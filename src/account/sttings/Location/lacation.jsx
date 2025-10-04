import React, { useEffect, useState } from "react";
import "./location.css";
import { useTranslation } from "react-i18next";
const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh",
  "Belgium", "Brazil", "Bulgaria", "Canada", "Chile", "China", "Colombia", "Croatia",
  "Czech Republic", "Denmark", "Egypt", "Estonia", "Finland", "France", "Germany",
  "Greece", "Hungary", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Japan", "Jordan", "Kenya", "Kuwait", "Latvia", "Lebanon", "Lithuania", "Luxembourg",
  "Malaysia", "Mexico", "Morocco", "Netherlands", "New Zealand", "Nigeria", "Norway",
  "Pakistan", "Palestine", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Saudi Arabia", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa",
  "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Thailand", "Tunisia", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Venezuela", "Vietnam", "Yemen", "Other"
];

const UserLocation = () => {
  const {t} = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState("Detecting...");

  // Detect using geolocation
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            const detected = data.address?.country || "Unknown location";
            setSelectedCountry(detected);
          } catch (err) {
            console.error("Error detecting location:", err);
            setSelectedCountry("Failed to detect");
          }
        },
        () => {
          setSelectedCountry("Permission denied");
        }
      );
    } else {
      setSelectedCountry("Geolocation not supported");
    }
  }, []);

  const handleChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  return (
    <div className="location-card">
      <h3 className="location-title">🌍 {t('Country Settings')}</h3>

      <label className="location-dropdown-label">
        <span>{t('change countre')}:</span>
        <select
          value={selectedCountry}
          onChange={handleChange}
          className="location-select"
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </label>

      <p className="location-final">
        <strong>{t('Selected Country')}:</strong> {selectedCountry}
      </p>
    </div>
  );
};

export default UserLocation;
