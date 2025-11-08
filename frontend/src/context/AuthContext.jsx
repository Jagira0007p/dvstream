import React, { createContext, useState, useContext } from "react";
import { checkAdminAuth } from "../api/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(
    !!localStorage.getItem("admin_password")
  );

  const login = async (password) => {
    try {
      await checkAdminAuth(password);
      localStorage.setItem("admin_password", password);
      setIsAdmin(true);
      return true;
    } catch (error) {
      console.error("Admin login failed:", error);
      localStorage.removeItem("admin_password");
      setIsAdmin(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_password");
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
