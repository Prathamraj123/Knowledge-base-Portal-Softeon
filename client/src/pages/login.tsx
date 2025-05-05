import { useEffect } from "react";
import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/context/auth-context";
import { useLocation } from "wouter";

export default function LoginPage() {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const [, navigate] = useLocation();
  
  // Check authentication status when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
      <LoginForm />
    </div>
  );
}
