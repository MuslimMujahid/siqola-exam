"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Send, Loader2, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { resendVerificationEmail } from "@/lib/api/auth";
import { isApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EmailVerificationErrorProps {
  message: string;
  email?: string;
}

export function EmailVerificationError({
  message,
  email,
}: EmailVerificationErrorProps) {
  const [showVerificationRequestMessage, setShowVerificationRequestMessage] =
    useState(true);
  const [showResendMessage, setShowResendMessage] = useState(false);

  const resendMutation = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: () => {
      setShowVerificationRequestMessage(false);
      setShowResendMessage(true);
      setTimeout(() => setShowResendMessage(false), 10000);
    },
    onError: (error) => {
      console.error("Failed to resend verification email:", error);
      setShowVerificationRequestMessage(false);
      setShowResendMessage(true);
      setTimeout(() => setShowResendMessage(false), 10000);
    },
  });

  const handleResendClick = () => {
    if (email && !resendMutation.isPending) {
      resendMutation.mutate({ email });
    }
  };

  if (showResendMessage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Alert variant="success">
          <Check className="w-4 h-4" />
          <AlertDescription>
            {resendMutation.isSuccess ? (
              <>
                Verification email sent! Check your inbox (including spam
                folder) for the new verification link.
              </>
            ) : resendMutation.isError ? (
              <>
                {isApiError(resendMutation.error)
                  ? resendMutation.error.response?.data?.message ||
                    "Failed to send verification email. Please try again or contact support."
                  : "Failed to send verification email. Please try again or contact support."}
              </>
            ) : (
              <>
                If you need a new verification link, please contact support or
                check your email for the original verification link.
              </>
            )}
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (showVerificationRequestMessage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Alert variant="warning">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Email Verification Required</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
            <p className="mt-2 text-xs opacity-80">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1 underline hover:no-underline font-medium",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                onClick={handleResendClick}
                disabled={resendMutation.isPending}
              >
                {resendMutation.isPending ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    sending...
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    request a new verification link
                  </>
                )}
              </button>
            </p>
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return null;
}
