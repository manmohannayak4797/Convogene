// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { login, logout, refreshToken } from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const newToken = await refreshToken(storedToken);
          setToken(newToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to refresh token:', error);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginUser = async (credentials) => {
    try {
      const { token } = await login(credentials);
      setToken(token);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);