// @ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );

  if (!isAuthenticated) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/" replace />;
  }

  // Render the protected content
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // Enforce that children must be a React node
};

export default ProtectedRoute;
