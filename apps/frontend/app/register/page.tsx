"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";
import {
  InstitutionRegisterForm,
  institutionRegisterSchema,
  type UserRoleType,
} from "@/lib/schemas/auth";
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

export default function RegisterPage() {
  const router = useRouter();
  const { isLoading, error, isAuthenticated } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRoleType>("institution");

  function register(data: Omit<InstitutionRegisterForm, "confirmPassword">) {
    // Placeholder for registration logic
    window.alert(`Registering institution: ${data.institutionName}`);
  }

  const form = useForm({
    defaultValues: {
      institutionName: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      phoneNumber: "",
    },
    onSubmit: async ({ value }) => {
      await register({
        institutionName: value.institutionName,
        email: value.email,
        password: value.password,
        address: value.address,
        phoneNumber: value.phoneNumber,
      });
    },
    validators: {
      onChange: institutionRegisterSchema,
    },
  });

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
            <h2 className="text-3xl font-bold tracking-tight text-primary">
              SiqolaExam
            </h2>
            <p className="text-lg text-muted-foreground">
              Join our family and we&apos;ll help you manage exams with ease.
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
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Easy Setup</h3>
                <p className="text-sm text-muted-foreground">
                  Get up and running in minutes with our intuitive platform.
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Powerful Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Track performance and gain insights with detailed reports.
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
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  Our team is always here to help you succeed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Column - Registration Form */}
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
                  Create Account
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Select your role to get started
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

            {selectedRole === "institution" ? (
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

                  <form.Field name="institutionName">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="institutionName">
                          Institution Name
                        </Label>
                        <Input
                          id="institutionName"
                          name="institutionName"
                          type="text"
                          placeholder="ABC University"
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

                  <form.Field name="email">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="admin@institution.com"
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

                  <form.Field name="phoneNumber">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          placeholder="+1234567890"
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

                  <form.Field name="address">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          type="text"
                          placeholder="123 Main Street, City"
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

                  <form.Field name="password">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
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

                  <form.Field name="confirmPassword">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
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
                    {isLoading ? "Creating Account..." : "Register"}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      Login here
                    </Link>
                  </div>
                </CardFooter>
              </form>
            ) : (
              <CardContent className="space-y-4 p-6 pt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-muted/50 border border-border/50 p-6 space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 mt-0.5">
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
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">
                        {selectedRole === "examiner"
                          ? "Examiner Account Request"
                          : "Examinee Account Request"}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedRole === "examiner"
                          ? "Examiner accounts are created by institutions. Please contact your institution administrator to request an examiner account."
                          : "Examinee accounts are created by institutions. Please contact your institution administrator to request an examinee account."}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div className="text-center text-sm text-muted-foreground pt-2">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Login here
                  </Link>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
