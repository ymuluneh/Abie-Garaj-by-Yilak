import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import loginService from "../services/login.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  const initializeAuth = useCallback(() => {
    const storedEmployee = localStorage.getItem("employee");
    if (storedEmployee) {
      try {
        const employeeData = JSON.parse(storedEmployee);
        setEmployee(employeeData);
        setIsLogged(true);
        setIsAdmin(employeeData.employee_role === 3);
      } catch (error) {
        console.error("Failed to parse employee data", error);
        logout();
      }
    }
  }, []);

  // Login function
  const login = useCallback((employeeData) => {
    localStorage.setItem("employee", JSON.stringify(employeeData));
    setEmployee(employeeData);
    setIsLogged(true);
    setIsAdmin(employeeData.employee_role === 3);
  }, []);

  // Logout function
  const logout = useCallback(() => {
    loginService.logOut();
    setEmployee(null);
    setIsLogged(false);
    setIsAdmin(false);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <AuthContext.Provider
      value={{
        isLogged,
        isAdmin,
        employee,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
