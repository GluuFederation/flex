import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );
  const config = useSelector((state) => state.authReducer.config);
  console.log("isAuthenticated", config);

  if (Object.keys(config).length === 0) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/" replace />;
  }

  // Render the protected content
  return children;
};

export default ProtectedRoute;
