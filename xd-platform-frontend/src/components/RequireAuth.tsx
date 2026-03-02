import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthed } = useAuth();
  const location = useLocation();

  if (!isAuthed) {
    // send them to login, remember where they wanted to go
    return <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />;
  }
  return <>{children}</>;
};

export default RequireAuth;
