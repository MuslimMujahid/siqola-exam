"use client";

import React from "react";

import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OtpInput } from "@/components/ui/otp-input";
import {
  useResendRegistrationOtp,
  useVerifyRegistrationOtp,
} from "../api/register";
import { useAuthStore } from "../store/auth";

type VerifyRegistrationProps = {
  searchParams: Promise<{ email?: string }>;
};

export function VerifyRegistration({ searchParams }: VerifyRegistrationProps) {
  const params = React.use(searchParams);
  const { setError } = useAuthStore();
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const [resendSuccess, setResendSuccess] = React.useState(false);

  const { mutate: resendOtp, isPending: isSendingOtp } =
    useResendRegistrationOtp();
  const { mutate: verifyOtp, isPending: isVerifyingOtp } =
    useVerifyRegistrationOtp();

  const handleVerify = () => {
    const otpString = otp.join("");
    if (!params.email || otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }
    setError(null);
    verifyOtp({ email: params.email, otp: otpString });
  };

  const handleResend = () => {
    if (!params.email) {
      setError("Email is missing. Please go back and register again.");
      return;
    }

    setError(null);
    resendOtp(
      { email: params.email },
      {
        onSuccess: () => {
          setResendSuccess(true);
          setTimeout(() => setResendSuccess(false), 5000);
        },
        onError: () => {
          setResendSuccess(false);
        },
      }
    );
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
                  <span className="font-medium text-foreground">
                    {params.email}
                  </span>
                  . Enter code below
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
                  disabled={isVerifyingOtp || isSendingOtp}
                />
              </div>

              <Button
                type="button"
                onClick={handleVerify}
                className="w-full max-w-sm h-10 rounded-md transition-all hover:scale-[1.01] active:scale-[0.99]"
                disabled={isVerifyingOtp || isSendingOtp}
              >
                {isVerifyingOtp ? "Verifying..." : "Verify Email"}
              </Button>

              <div className="space-y-3 pt-2">
                <div className="text-center text-sm text-muted-foreground">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isVerifyingOtp || isSendingOtp}
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
