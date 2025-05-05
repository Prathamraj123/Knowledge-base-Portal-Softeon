import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Captcha } from "@/components/captcha";
import { useCaptcha } from "@/hooks/use-captcha";
import { useAuth } from "@/context/auth-context";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const { captcha, generateCaptcha, verifyCaptcha } = useCaptcha();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      employeeId: "",
      password: "",
      captcha: "",
    },
  });

  // Generate captcha when component mounts
  useEffect(() => {
    generateCaptcha();
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    setLoginError(null);
    
    // Verify captcha first
    if (!verifyCaptcha(data.captcha)) {
      form.setError("captcha", { 
        type: "manual", 
        message: "Incorrect verification code" 
      });
      return;
    }
    
    try {
      // Attempt login
      await login(data.employeeId, data.password);
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError("Failed to login. Please try again.");
      }
      
      // Generate new captcha after failed login
      generateCaptcha();
      form.setValue("captcha", "");
    }
  };

  return (
    <Card className="w-full max-w-md mx-4">
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-neutral-700">Knowledge Base Portal</h1>
          <p className="text-neutral-500 mt-2">
            Please log in to access the organization's knowledge base
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your employee ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="captcha"
                render={({ field }) => (
                  <FormItem>
                    <Captcha
                      captchaText={captcha}
                      onRefresh={generateCaptcha}
                      field={field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {loginError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
