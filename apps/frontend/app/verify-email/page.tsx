"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Send,
  ArrowRight,
} from "lucide-react";
import { useVerifyEmail } from "@/hooks";
import { isApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

type VerificationState = "verifying" | "success" | "error" | "no-token";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Initialize state based on token presence
  const [state, setState] = useState<VerificationState>(
    token ? "verifying" : "no-token"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const { verify, resend, isResending, isResendSuccess } = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      return;
    }

    // Automatically verify when component mounts
    verify(token)
      .then((data) => {
        setState("success");
        setUserEmail(data.user.email);
      })
      .catch((error) => {
        setState("error");
        if (isApiError(error)) {
          setErrorMessage(
            error.response?.data?.message || "Failed to verify email"
          );
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      });
  }, [token, verify]);

  const handleResendVerification = () => {
    if (token) {
      resend({ token });
    }
  };

  const renderContent = () => {
    switch (state) {
      case "verifying":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Verifying Email</CardTitle>
                <CardDescription>
                  Please wait while we verify your email address...
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        );

      case "success":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.1,
                    }}
                    className="rounded-full bg-green-100 dark:bg-green-950 p-3"
                  >
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </motion.div>
                </div>
                <CardTitle className="text-2xl">Email Verified!</CardTitle>
                <CardDescription>
                  Your email address has been successfully verified. You can now
                  log in to your account.
                </CardDescription>
              </CardHeader>

              {userEmail && (
                <CardContent>
                  <Alert>
                    <Mail className="w-4 h-4" />
                    <AlertDescription>
                      <span className="font-medium">{userEmail}</span> is now
                      verified
                    </AlertDescription>
                  </Alert>
                </CardContent>
              )}

              <CardFooter className="flex flex-col gap-3">
                <Button
                  className="w-full"
                  onClick={() => router.push("/login")}
                >
                  Continue to Login
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );

      case "error":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-destructive/10 p-3">
                    <XCircle className="w-8 h-8 text-destructive" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Verification Failed</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <Alert variant="warning">
                  <AlertDescription>
                    <span>
                      This verification token is invalid or has expired. Please
                      use the verification link sent to your email or{" "}
                      <span className="underline font-bold">
                        request a new verification email
                      </span>
                      .
                    </span>
                  </AlertDescription>
                </Alert>

                {isResendSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert variant="success">
                      <CheckCircle className="w-4 h-4" />
                      <AlertDescription>
                        A new verification email has been sent. Please check
                        your inbox and spam folder.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );

      case "no-token":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-orange-100 dark:bg-orange-950 p-3">
                    <Mail className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl">No Token Provided</CardTitle>
                <CardDescription>
                  A verification token is required to verify your email
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Alert variant="warning">
                  <AlertDescription>
                    Please use the verification link sent to your email, or
                    request a new one from the login page.
                  </AlertDescription>
                </Alert>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <Button
                  className="w-full"
                  onClick={() => router.push("/login")}
                >
                  Go to Login
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary">SiqolaExam</h1>
          </Link>
        </motion.div>

        {renderContent()}
      </div>
    </div>
  );
}
