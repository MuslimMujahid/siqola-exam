"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { useAuthStore } from "@/store/auth";
import { getDashboardRoute } from "@/lib/utils/dashboard";
import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoute = getDashboardRoute(user.memberships);
      router.push(dashboardRoute);
    }
  }, [isAuthenticated, user, router]);

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
        <LoginForm />
      </div>
    </div>
  );
}
