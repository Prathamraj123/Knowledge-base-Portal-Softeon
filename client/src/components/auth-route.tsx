import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Redirect } from "wouter";

interface AuthRouteProps {
  children: ReactNode;
}

export function AuthRoute({ children }: AuthRouteProps) {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  if (isAuthenticated === false) {
    return <Redirect to="/login" />;
  }
  
  return <>{children}</>;
}

export function GuestRoute({ children }: AuthRouteProps) {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  if (isAuthenticated === true) {
    return <Redirect to="/" />;
  }
  
  return <>{children}</>;
}