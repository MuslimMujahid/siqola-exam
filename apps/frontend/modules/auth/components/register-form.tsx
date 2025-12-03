"use client";

import { useForm } from "@tanstack/react-form";
import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRequestRegistrationOtp } from "../api/register";
import { useAuthStore } from "../store/auth";
import { registerSchema } from "../schemas/auth";

export function RegisterForm() {
  const { setError } = useAuthStore();

  const { mutate: handleRequestOtp, isPending } = useRequestRegistrationOtp();

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
      setError(null);
      // Request OTP to be sent to the provided email
      handleRequestOtp({
        institutionName: value.institutionName,
        email: value.email,
        password: value.password,
        address: value.address,
        phoneNumber: value.phoneNumber,
      });
    },
    validators: {
      onSubmit: registerSchema,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <CardContent className="space-y-4 p-6 pt-0">
        {useAuthStore.getState().error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive"
          >
            {useAuthStore.getState().error}
          </motion.div>
        )}

        <form.Field name="institutionName">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="institutionName">Nama Institusi</Label>
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

        <form.Field name="phoneNumber">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Nomor HP</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+6281234567890"
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

        <form.Field name="address">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
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
              <Label htmlFor="password">Kata Sandi</Label>
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

        <form.Field name="confirmPassword">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Ulang Kata Sandi</Label>
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
          {isPending ? "Mengirim OTP..." : "Daftar"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Masuk di sini
          </Link>
        </div>
      </CardFooter>
    </form>
  );
}
