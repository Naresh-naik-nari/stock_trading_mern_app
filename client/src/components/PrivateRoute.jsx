import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const PrivateRoute = ({ children }) => {
  const { userData, loading } = useContext(UserContext);

  if (loading) {
    // Optionally, render a loading spinner or null while loading
    return null;
  }

  if (!userData?.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
