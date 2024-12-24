import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.get("/auth/me");
          const { user } = response.data.data;
          setUser(user);
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const { accessToken, user } = response.data.data;
    localStorage.setItem("token", accessToken);
    setUser(user);
    return { success: true, user };
  };

  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    const { accessToken, user } = response.data.data;
    localStorage.setItem("token", accessToken);
    setUser(user);
    return { success: true, user };
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  if (!isInitialized) {
    return null; // or a loading component
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
