import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface AuthContextType {
  isAuthenticated: boolean;
  employeeId: string | null;
  login: (employeeId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  // Check if user is authenticated
  const checkAuthStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/auth-check", {
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to check authentication status");
      }
      
      const data = await res.json();
      
      if (data.isAuthenticated) {
        setIsAuthenticated(true);
        setEmployeeId(data.employeeId);
      } else {
        setIsAuthenticated(false);
        setEmployeeId(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setEmployeeId(null);
    }
  }, []);

  // Login function
  const login = useCallback(async (employeeId: string, password: string) => {
    try {
      const res = await apiRequest("POST", "/api/login", {
        employeeId,
        password,
        captcha: "verified", // Captcha is verified client-side
      });
      
      const data = await res.json();
      
      // Set authentication state
      setIsAuthenticated(true);
      setEmployeeId(data.employeeId);
      
      // Clear any cached queries
      queryClient.clear();
    } catch (error) {
      // Handle login error
      throw new Error("Invalid employee ID or password");
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await apiRequest("POST", "/api/logout", {});
      
      // Reset authentication state
      setIsAuthenticated(false);
      setEmployeeId(null);
      
      // Clear any cached queries
      queryClient.clear();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  const value = {
    isAuthenticated,
    employeeId,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
