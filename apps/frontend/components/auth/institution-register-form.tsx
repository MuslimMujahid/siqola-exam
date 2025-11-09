"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AxiosError } from "axios";
import { useAuthStore } from "@/store/auth";
import { institutionRegisterSchema } from "@/lib/schemas/auth";
import { registerInstitution } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";

export function InstitutionRegisterForm() {
  const router = useRouter();
  const { setInstitution, setUser, setAuthenticated, setLoading, setError } =
    useAuthStore();

  const registerMutation = useMutation({
    mutationFn: registerInstitution,
    onSuccess: (data) => {
      // Store institution and user data in auth store
      setInstitution({
        id: data.institution.id,
        institutionName: data.institution.name,
        email: data.user.email,
        address: undefined,
        phoneNumber: undefined,
      });
      setUser({
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.fullName,
        role: data.membership.role,
      });
      setAuthenticated(true);
      setError(null);
      setLoading(false);

      // Redirect to dashboard
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ message: string; error?: string }>) => {
      setLoading(false);
      // Handle error from API
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    },
  });

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
      setLoading(true);
      setError(null);
      registerMutation.mutate({
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
              <Label htmlFor="institutionName">Institution Name</Label>
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
                disabled={registerMutation.isPending}
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
                disabled={registerMutation.isPending}
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
                disabled={registerMutation.isPending}
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
                disabled={registerMutation.isPending}
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
                disabled={registerMutation.isPending}
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
              <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                disabled={registerMutation.isPending}
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
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating Account..." : "Register"}
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
  );
}
