"use client";

import React from "react";

import { useForm } from "@tanstack/react-form";
import { motion } from "framer-motion";
import { XCircleIcon } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RoleSelectionTabs } from "@/components/ui/role-selection-tabs";
import { isApiError } from "@/lib/api/client";
import { UserRole } from "@/modules/users/entities";
import { useLogin } from "../api/login";
import { loginSchema } from "../schemas/auth";

type LoginFormProps = {
  invitationAccepted?: boolean;
};

export function LoginForm({ invitationAccepted = false }: LoginFormProps) {
  const { mutate: handleLogin, isPending, error } = useLogin();
  const [selectedRole, setSelectedRole] = React.useState<UserRole>("ADMIN");
  const [showInvitationAlert, setShowInvitationAlert] =
    React.useState(invitationAccepted);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      role: "ADMIN" as UserRole,
    },
    onSubmit: ({ value }) => {
      handleLogin({
        email: value.email,
        password: value.password,
      });
    },
    validators: {
      onSubmit: loginSchema,
    },
  });

  // Update form when role changes
  React.useEffect(() => {
    form.setFieldValue("role", selectedRole);
  }, [form, selectedRole]);

  return (
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
              Selamat Datang
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Pilih peran Anda dan masukkan kredensial
            </CardDescription>
          </div>

          <RoleSelectionTabs
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
          />
        </CardHeader>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <CardContent className="space-y-4 p-6 pt-0">
            {showInvitationAlert && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
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
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary">
                      Undangan Berhasil Diterima!
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Silakan masuk dengan akun Anda untuk melanjutkan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInvitationAlert(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
            {error && isApiError(error) && (
              <Alert variant="error">
                <XCircleIcon className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>
                  {isApiError(error)
                    ? error.response?.data?.message ||
                      error.message ||
                      "Login failed. Please try again."
                    : "Login failed. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            <form.Field name="email">
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
                    disabled={isPending}
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Kata Sandi</Label>
                    <Link
                      href="/reset-password"
                      className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      Lupa kata sandi?
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
                    disabled={isPending}
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
              disabled={isPending}
            >
              {isPending ? "Masuk..." : "Masuk"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Daftar di sini
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
