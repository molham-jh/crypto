import React, { useEffect, useState } from "react";
import './AccountOutThere.css'
import { useTranslation } from "react-i18next";
const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const {t} = useTranslation()

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  return (
    <div className="accounts-container">
      <h2>👥 {t('all account')}</h2>
      {users.length === 0 ? (
        <p>{t('there is no accounts yet')}</p>
      ) : (
        users.map((user, index) => (
          <div
          className="account"
            key={user.id}
            style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}
          >
            <p>
              <strong>{index + 1}. 👤 {t('name')}:</strong> {user.name}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default AllUsers;
