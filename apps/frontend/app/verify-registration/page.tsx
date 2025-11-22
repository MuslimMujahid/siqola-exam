"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AxiosError } from "axios";
import { resendRegistrationOtp, verifyRegistrationOtp } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyRegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const [resendSuccess, setResendSuccess] = React.useState(false);
  const { setError, setUser, setToken, setAuthenticated } = useAuthStore();

  const verifyMutation = useMutation({
    mutationFn: verifyRegistrationOtp,
    onSuccess: (data) => {
      setError(null);

      // Auto-login
      if (data.token) {
        setToken(data.token);
        setUser(data.user);
        setAuthenticated(true);
        router.push("/dashboard/admin");
      }
    },
    onError: (error: AxiosError<{ message: string; error?: string }>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "OTP verification failed. Please try again.";

      setError(errorMessage);
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendRegistrationOtp,
    onSuccess: () => {
      setError(null);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    },
    onError: (error: AxiosError<{ message: string; error?: string }>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to resend OTP. Please try again.";
      setError(errorMessage);
      setResendSuccess(false);
    },
  });

  const handleVerify = () => {
    const otpString = otp.join("");
    if (!email || otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }
    setError(null);
    verifyMutation.mutate({ email, otp: otpString });
  };

  const handleResend = () => {
    if (!email) {
      setError("Email is missing. Please go back and register again.");
      return;
    }
    setError(null);
    resendMutation.mutate({ email });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full"
        >
          <Card className="w-full border-border/50 shadow-sm">
            <CardHeader className="space-y-4 p-6">
              <div className="space-y-2 text-center">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  Verify Your Email
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  We&apos;ve sent a verification code to{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                  Enter code below
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6 pt-0 flex flex-col items-center">
              {useAuthStore.getState().error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive w-full"
                >
                  {useAuthStore.getState().error}
                </motion.div>
              )}

              {resendSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-primary/10 border border-primary/20 p-4 text-sm text-primary w-full"
                >
                  A new verification code has been sent to your email.
                </motion.div>
              )}

              <div className="w-full max-w-sm">
                <OtpInput
                  length={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={
                    verifyMutation.isPending || resendMutation.isPending
                  }
                />
              </div>

              <Button
                type="button"
                onClick={handleVerify}
                className="w-full max-w-sm h-10 rounded-md transition-all hover:scale-[1.01] active:scale-[0.99]"
                disabled={verifyMutation.isPending || resendMutation.isPending}
              >
                {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
              </Button>

              <div className="space-y-3 pt-2">
                <div className="text-center text-sm text-muted-foreground">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={
                      verifyMutation.isPending || resendMutation.isPending
                    }
                    className="text-primary hover:text-primary/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend Code
                  </button>
                </div>

                <div className="text-center text-sm text-muted-foreground border-t border-border/50 pt-4">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Login here
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
