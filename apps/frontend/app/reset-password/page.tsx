"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { motion } from "framer-motion";
import { passwordResetSchema } from "@/lib/schemas/auth";
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

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestPasswordReset(email: string) {
    setIsLoading(true);
    setError(null);
    try {
      // Placeholder for password reset logic
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      await requestPasswordReset(value.email);
    },
    validators: {
      onChange: passwordResetSchema,
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="w-full border-border/50 shadow-sm">
          <CardHeader className="space-y-2 p-6">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Reset Password
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isSuccess
                ? "Check your email for the reset link"
                : "Enter your email to receive a password reset link"}
            </CardDescription>
          </CardHeader>

          {isSuccess ? (
            <CardContent className="p-6 pt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-lg bg-primary/10 border border-primary/20 p-4"
              >
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-primary mt-0.5"
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
                  <div>
                    <p className="text-sm font-medium">Success!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      We&apos;ve sent a password reset link to your email.
                      Please check your inbox and follow the instructions.
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Return to login
                </Link>
              </div>
            </CardContent>
          ) : (
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
                    onChange: passwordResetSchema.shape.email,
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
                          setError(null);
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
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Back to login
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
