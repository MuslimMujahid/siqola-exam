"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";
import { loginSchema, type UserRoleType } from "@/lib/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { isLoading, error, isAuthenticated } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRoleType>("institution");

  function login(email: string, password: string, role: UserRoleType) {
    // Placeholder for login logic
    window.alert(`Logging in as ${role} with ${email} and ${password}`);
  }

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      role: "institution" as UserRoleType,
    },
    onSubmit: async ({ value }) => {
      await login(value.email, value.password, value.role);
    },
    validators: {
      onChange: loginSchema,
    },
  });

  // Update form when role changes
  useEffect(() => {
    form.setFieldValue("role", selectedRole);
  }, [selectedRole]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Column - Hero Content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden lg:flex flex-col justify-center px-12 xl:px-20 bg-muted/30"
      >
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight text-primary">
              SiqolaExam
            </h2>
            <p className="text-lg text-muted-foreground">
              Sign in to access your institution&apos;s exam management
              platform.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 mt-1">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Secure & Reliable</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is protected with enterprise-grade security.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 mt-1">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Fast & Efficient</h3>
                <p className="text-sm text-muted-foreground">
                  Streamlined exam management for better productivity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 mt-1">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Collaborative</h3>
                <p className="text-sm text-muted-foreground">
                  Work seamlessly with your team and students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Column - Login Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="w-full max-w-md"
        >
          <Card className="w-full border-border/50 shadow-sm">
            <CardHeader className="space-y-4 p-6">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Select your role and enter your credentials
                </CardDescription>
              </div>

              {/* Role Selection Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-muted/50 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSelectedRole("institution")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    selectedRole === "institution"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Institution
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("examiner")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    selectedRole === "examiner"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Examiner
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("examinee")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    selectedRole === "examinee"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Examinee
                </button>
              </div>
            </CardHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <CardContent className="space-y-4 p-6 pt-0">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive"
                  >
                    {error}
                  </motion.div>
                )}

                <form.Field
                  name="email"
                  validators={{
                    onChange: loginSchema.shape.email,
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="institution@example.com"
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                        }}
                        onBlur={field.handleBlur}
                        aria-invalid={!!field.state.meta.errors.length}
                        disabled={isLoading}
                      />
                      {!field.state.meta.isValid && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors?.[0]?.message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="password"
                  validators={{
                    onChange: loginSchema.shape.password,
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                          href="/reset-password"
                          className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                        }}
                        onBlur={field.handleBlur}
                        aria-invalid={!!field.state.meta.errors.length}
                        disabled={isLoading}
                      />
                      {!field.state.meta.isValid && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors?.[0]?.message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 p-6 pt-0">
                <Button
                  type="submit"
                  className="w-full h-10 rounded-md transition-all hover:scale-[1.01] active:scale-[0.99]"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Register here
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
