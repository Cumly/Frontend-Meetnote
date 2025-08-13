// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { getUserInfo, loginGoogle } from "../services/googleService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserInfo();
        setUser(userData);
      } catch (err) {
        // Si no hay sesión, redirige al login
        loginGoogle();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
