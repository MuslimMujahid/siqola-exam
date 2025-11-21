"use client";

import React from "react";

import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

import { useLogin } from "@/hooks/use-login";
import { loginSchema, type UserRoleType } from "@/lib/schemas/auth";
import { RoleSelectionTabs } from "@/components/ui/role-selection-tabs";
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
import { isApiError } from "@/lib/api/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function LoginForm() {
  const { login: handleLogin, isLoading, error } = useLogin();
  const [selectedRole, setSelectedRole] = React.useState<UserRoleType>("admin");

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      role: "admin" as UserRoleType,
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
            {error && isApiError(error) && (
              <Alert variant="error">
                <XCircle className="h-4 w-4" />
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
              {isLoading ? "Masuk..." : "Masuk"}
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
