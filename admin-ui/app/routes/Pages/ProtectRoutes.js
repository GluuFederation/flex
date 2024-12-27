import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.authReducer.isAuthenticated);
  console.log("isAuthenticated",isAuthenticated)

  if (!isAuthenticated) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/" replace />;
  }

  // Render the protected content
  return children;
};

export default ProtectedRoute;