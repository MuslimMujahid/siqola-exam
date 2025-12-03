import { userRole } from "@/modules/users/entities";
import { z } from "zod";

// Login Schema (for all roles)
export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(Object.values(userRole)),
});

// Institution Register Schema
export const registerSchema = z
  .object({
    institutionName: z
      .string()
      .min(2, "Institution name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    address: z.string().min(5, "Address must be at least 5 characters"),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Password Reset Schema
export const passwordResetSchema = z.object({
  email: z.email("Invalid email address"),
});

// Email Verification Schema
export const emailVerificationSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

// Type exports
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type PasswordResetForm = z.infer<typeof passwordResetSchema>;
export type EmailVerificationForm = z.infer<typeof emailVerificationSchema>;
