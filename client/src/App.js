import React, { useEffect, useContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import styles from "./App.module.css";
import { Login, Register, NotFound, PageTemplate } from "./components";
import Chatbot from "./components/Chatbot/ChatbotWithGemini";
import UserContext, { UserProvider } from "./context/UserContext";
import Axios from "axios";
import config from "./config/Config";
import ImprovedLoadingSpinner from "./components/Loading/ImprovedLoadingSpinner";
import PrivateRoute from "./components/PrivateRoute";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const { userData, setUserData, loading } = useContext(UserContext);
  const [skipAuthCheck, setSkipAuthCheck] = useState(false);

  // Reset global styles to remove any default margins/padding
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.boxSizing = 'border-box';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.boxSizing = 'border-box';
  }, []);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        let token = localStorage.getItem("auth-token");
        
        // Don't clear token if it doesn't exist - just set undefined state
        if (!token || token === "") {
          setUserData({ token: undefined, user: undefined });
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
          // Only clear localStorage if token validation explicitly fails
          console.log("Token validation failed, clearing localStorage");
          localStorage.removeItem("auth-token");
          localStorage.removeItem("user-data");
          setUserData({ token: undefined, user: undefined });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Don't clear localStorage on network errors - might be temporary
        console.log("Auth check failed due to network error, keeping token for retry");
        setUserData({ token: undefined, user: undefined });
      }
    };

    if (!loading && !skipAuthCheck) {
      checkLoggedIn();
    }
  }, [loading, setUserData, skipAuthCheck]);

  useEffect(() => {
    if (userData.token) {
      setSkipAuthCheck(true);
      const timer = setTimeout(() => {
        setSkipAuthCheck(false);
      }, 3000); // skip auth check for 3 seconds after login
      return () => clearTimeout(timer);
    }
  }, [userData.token]);

  if (loading) {
    return (
      <ImprovedLoadingSpinner 
        fullScreen 
        text="Initializing Stock Trading Simulator..." 
        size={60} 
      />
    );
  }

  return (
    <Router>
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        margin: 0, 
        padding: 0,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        <Routes>
          <Route path="/" element={<Navigate to={userData.user ? "/dashboard" : "/login"} replace />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <PageTemplate />
            </PrivateRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {userData.user && <Chatbot />}
      </div>
    </Router>
  );
}

const AppWrapper = () => (
  <ErrorBoundary>
    <UserProvider>
      <App />
    </UserProvider>
  </ErrorBoundary>
);

export default AppWrapper;
