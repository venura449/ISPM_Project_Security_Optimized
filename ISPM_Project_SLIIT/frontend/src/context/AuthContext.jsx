import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useApi } from "../hooks/useApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { apiFetch } = useApi();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Check if session is valid on mount
  useEffect(() => {
    verifySession();
  }, []);

  // Verify session validity via HttpOnly cookie
  const verifySession = async () => {
    try {
      const userType = localStorage.getItem("userType");
      const endpoint = userType === "employee" ? "/employee-auth/verify" : "/auth/verify";
      // apiFetch automatically includes credentials: "include"
      const response = await apiFetch(endpoint, {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.decoded || data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Session verification error:", err);
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
      const response = await apiFetch(`/auth/register`, {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        toast.error(data.message, { position: "top-right", autoClose: 3000 });
        return { success: false, message: data.message };
      }

      toast.success(
        "Account created successfully! 🎉 Please sign in with your credentials.",
        { position: "top-right", autoClose: 2500 }
      );
      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message);
      toast.error("Connection error: " + err.message, { position: "top-right", autoClose: 3000 });
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  // Login user
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch(`/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        toast.error(data.message, { position: "top-right", autoClose: 3000 });
        return { success: false, message: data.message };
      }

      setUser(data.user);
      toast.success("Welcome back! 🚀", { position: "top-right", autoClose: 2500 });
      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message);
      toast.error("Connection error: " + err.message, { position: "top-right", autoClose: 3000 });
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  // Logout user
  const logout = useCallback(async () => {
    try {
      const userType = localStorage.getItem("userType");
      const endpoint = userType === "employee" ? "/employee-auth/logout" : "/auth/logout";
      
      await apiFetch(endpoint, { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    }

    setUser(null);
    setError(null);
    toast.info("Logged out", { position: "top-right", autoClose: 1500 });
  }, [apiFetch]);

  // Update user profile
  const updateProfile = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  const value = {
    user,
    setUser,
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