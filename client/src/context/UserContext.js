import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const user = localStorage.getItem("user-data");
    if (token && user) {
      setUserData({
        token,
        user: JSON.parse(user),
      });
    }
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
