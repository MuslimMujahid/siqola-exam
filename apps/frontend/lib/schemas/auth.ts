import { z } from "zod";

// User roles
export const UserRole = z.enum(["admin", "examiner", "examinee"]);

// Login Schema (for all roles)
export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: UserRole,
});

// Legacy Institution Login Schema (for backward compatibility)
export const institutionLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Institution Register Schema
export const institutionRegisterSchema = z
  .object({
    institutionName: z
      .string()
      .min(2, "Institution name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
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
  email: z.string().email("Invalid email address"),
});

// Email Verification Schema
export const emailVerificationSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

// Type exports
export type UserRoleType = z.infer<typeof UserRole>;
export type LoginForm = z.infer<typeof loginSchema>;
export type InstitutionLoginForm = z.infer<typeof institutionLoginSchema>;
export type InstitutionRegisterForm = z.infer<typeof institutionRegisterSchema>;
export type PasswordResetForm = z.infer<typeof passwordResetSchema>;
export type EmailVerificationForm = z.infer<typeof emailVerificationSchema>;
