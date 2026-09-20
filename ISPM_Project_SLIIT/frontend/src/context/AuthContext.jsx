import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import { useApi } from "../hooks/useApi";

const { apiFetch } = useApi();

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `/auth`;

  // Check if token is valid on mount
  useEffect(() => {
    verifyToken(token);
  }, []);

  // Verify token validity
  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await apiFetch(`${API_URL}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setToken(tokenToVerify);
      } else {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error("Token verification error:", err);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        toast.error(data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return { success: false, message: data.message };
      }

      // Don't auto-login after registration, user must login separately
      toast.success(
        "Account created successfully! 🎉 Please sign in with your credentials.",
        {
          position: "top-right",
          autoClose: 2500,
        },
      );
      return { success: true, message: data.message };
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      toast.error("Connection error: " + errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Login user
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        toast.error(data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return { success: false, message: data.message };
      }

      setUser(data.user);
      
      toast.success("Welcome back! 🚀", {
        position: "top-right",
        autoClose: 2500,
      });
      return { success: true, message: data.message };
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      toast.error("Connection error: " + errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout user
  const logout = useCallback(async() => {

    try{
      await apiFetch(`${API_URL}/logout`,{
        method: "POST",
      });
    }catch(err){
      console.error("Logout error:", err);
    }

    setUser(null);
    setError(null);
    toast.info("Logged out", {
      position: "top-right",
      autoClose: 1500,
    });
  }, []);

  // Update user profile
  const updateProfile = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
