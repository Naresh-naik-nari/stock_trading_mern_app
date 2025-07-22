import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styles from "./App.module.css";
import { Login, Register, NotFound, PageTemplate } from "./components";
import Chatbot from "./components/Chatbot/Chatbot";
import UserContext from "./context/UserContext";
import Axios from "axios";
import config from "./config/Config";
import LoadingSpinner from "./components/Loading/LoadingSpinner";

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        setAuthLoading(true);
        let token = localStorage.getItem("auth-token");
        if (token == null) {
          localStorage.setItem("auth-token", "");
          token = "";
          setUserData({ token: undefined, user: undefined });
          setAuthLoading(false);
          return;
        }

        const headers = {
          "x-auth-token": token,
        };

        const tokenIsValid = await Axios.post(
          config.base_url + "/api/auth/validate",
          null,
          {
            headers,
          }
        );

        if (tokenIsValid.data) {
          const userRes = await Axios.get(config.base_url + "/api/auth/user", {
            headers,
          });
          setUserData({
            token,
            user: userRes.data,
          });
        } else {
          setUserData({ token: undefined, user: undefined });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUserData({ token: undefined, user: undefined });
      } finally {
        setAuthLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  if (authLoading) {
    return (
      <LoadingSpinner 
        fullScreen 
        text="Initializing Stock Trading Simulator..." 
        size={60} 
      />
    );
  }

  return (
    <Router>
      <UserContext.Provider value={{ userData, setUserData }}>
        <div className={styles.container}>
          <Routes>
            {userData.user ? (
              <Route path="/" element={<PageTemplate />} />
            ) : (
              <Route path="/" element={<Register />} />
            )}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {userData.user && <Chatbot />}
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
