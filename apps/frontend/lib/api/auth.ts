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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
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
 * Logout user
 */
export function logout(): void {
  localStorage.removeItem("token");
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
