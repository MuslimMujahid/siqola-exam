import { apiClient } from "./client";

// Types based on backend DTOs
export interface RegisterInstitutionRequest {
  institutionName: string;
  email: string;
  password: string;
  address?: string;
  phoneNumber?: string;
}

export interface CreateInstitutionDto {
  name: string;
  logo?: string;
}

export interface RegisterUserDto {
  email: string;
  password: string;
  fullName: string;
  studentId?: string;
  institutionId: string;
  role: "ADMIN" | "EXAMINER" | "EXAMINEE";
}

export interface RegisterInstitutionResponse {
  institution: {
    id: string;
    name: string;
    logo?: string;
    createdAt: string;
  };
  user: {
    id: string;
    email: string;
    fullName: string;
    createdAt: string;
  };
  membership: {
    id: string;
    userId: string;
    institutionId: string;
    role: string;
    status: string;
  };
  verificationToken: {
    token: string;
    expiresAt: string;
  };
}

export interface RequestRegistrationOtpRequest {
  institutionName: string;
  email: string;
  password: string;
  address?: string;
  phoneNumber?: string;
}

export interface RequestRegistrationOtpResponse {
  message: string;
  email: string;
  expiresAt: string;
}

export interface VerifyRegistrationOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyRegistrationOtpResponse {
  institution: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    email: string;
    fullName: string;
    memberships: Array<{
      id: string;
      role: string;
      status: string;
      institution: {
        id: string;
        name: string;
        logo?: string;
      };
    }>;
  };
  token: string;
}

export interface ResendRegistrationOtpRequest {
  email: string;
}

export interface ResendRegistrationOtpResponse {
  message: string;
  email: string;
  expiresAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    emailVerified: boolean;
    memberships: Array<{
      id: string;
      role: string;
      status: string;
      institution: {
        id: string;
        name: string;
        logo?: string;
      };
    }>;
  };
  token: string;
}

/**
 * Register a new institution with an admin user
 */
export async function registerInstitution(
  data: RegisterInstitutionRequest
): Promise<RegisterInstitutionResponse> {
  console.log("Registering institution with data:", data);
  const response = await apiClient.post<RegisterInstitutionResponse>(
    "/auth/register-institution",
    data
  );

  return response.data;
}

export async function requestRegistrationOtp(
  data: RequestRegistrationOtpRequest
): Promise<RequestRegistrationOtpResponse> {
  const response = await apiClient.post<RequestRegistrationOtpResponse>(
    "/auth/request-registration-otp",
    data
  );
  return response.data;
}

export async function verifyRegistrationOtp(
  data: VerifyRegistrationOtpRequest
): Promise<VerifyRegistrationOtpResponse> {
  const response = await apiClient.post<VerifyRegistrationOtpResponse>(
    "/auth/verify-registration-otp",
    data
  );
  // Store the token in localStorage for auto-login
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
}

export async function resendRegistrationOtp(
  data: ResendRegistrationOtpRequest
): Promise<ResendRegistrationOtpResponse> {
  const response = await apiClient.post<ResendRegistrationOtpResponse>(
    "/auth/resend-registration-otp",
    data
  );
  return response.data;
}

/**
 * Login user
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", data);

  // Store the token in localStorage
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<{
  message: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}> {
  const response = await apiClient.post(`/auth/verify-email?token=${token}`);
  return response.data;
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail({
  email,
  token,
}: {
  email?: string;
  token?: string;
}): Promise<{
  message: string;
  token: string;
  expiresAt: string;
}> {
  const response = await apiClient.post("/auth/resend-verification", {
    email,
    token,
  });
  return response.data;
}

/**
 * Logout user
 */
export function logout(): void {
  localStorage.removeItem("token");
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
