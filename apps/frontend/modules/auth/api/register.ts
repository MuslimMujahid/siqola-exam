import { useRouter } from "next/navigation";

import { apiClient, isApiError } from "@/lib/api/client";
import { useMutationWrapper } from "@/hooks/use-mutation";
import { getDashboardRoute } from "@/lib/utils/dashboard";
import { useAuthStore, User } from "../store/auth";

export interface RequestRegistrationOtpParams {
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

export interface ResendRegistrationOtpParams {
  email: string;
}

export interface ResendRegistrationOtpResponse {
  message: string;
  email: string;
  expiresAt: string;
}

export interface VerifyRegistrationOtpParams {
  email: string;
  otp: string;
}

export interface VerifyRegistrationOtpResponse {
  institution: {
    id: string;
    name: string;
  };
  user: User;
  token: string;
}

/** Request a registration OTP */
export async function requestRegistrationOtp(
  data: RequestRegistrationOtpParams
): Promise<RequestRegistrationOtpResponse> {
  const response = await apiClient.post<RequestRegistrationOtpResponse>(
    "/auth/request-registration-otp",
    data
  );
  return response.data;
}

/** Resend registration OTP */
export async function resendRegistrationOtp(
  data: ResendRegistrationOtpParams
): Promise<ResendRegistrationOtpResponse> {
  const response = await apiClient.post<ResendRegistrationOtpResponse>(
    "/auth/resend-registration-otp",
    data
  );
  return response.data;
}

/** Verify registration OTP */
export async function verifyRegistrationOtp(
  data: VerifyRegistrationOtpParams
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

/** Custom hook for requesting registration OTP */
export function useRequestRegistrationOtp() {
  const router = useRouter();
  const { setError } = useAuthStore();

  return useMutationWrapper({
    mutationFn: requestRegistrationOtp,
    onSuccess: (data) => {
      setError(null);
      // Redirect to verify page with email in URL
      router.push(
        `/verify-registration?email=${encodeURIComponent(data.email)}`
      );
    },
    onError: (error) => {
      if (isApiError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed. Please try again.";
        setError(errorMessage);
      }
    },
  });
}

/** Custom hook for resending registration OTP */
export function useResendRegistrationOtp() {
  const { setError } = useAuthStore();

  return useMutationWrapper({
    mutationFn: resendRegistrationOtp,
    onSuccess: () => {
      setError(null);
    },
    onError: (error) => {
      if (isApiError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to resend OTP. Please try again.";
        setError(errorMessage);
      }
    },
  });
}

/** Custom hook for verifying registration OTP */
export const useVerifyRegistrationOtp = () => {
  const router = useRouter();
  const { setAuthenticated, setError, setToken, setUser, setInstitution } =
    useAuthStore();

  return useMutationWrapper({
    mutationFn: verifyRegistrationOtp,
    onSuccess: (data) => {
      setError(null);

      // Auto-login after successful OTP verification
      setToken(data.token);
      setUser(data.user);
      setInstitution(data.user.memberships?.[0]?.institution ?? null);
      setAuthenticated(true);

      // Redirect to appropriate dashboard based on user's role
      const dashboardRoute = getDashboardRoute(data.user.role);
      router.push(dashboardRoute);
    },
    onError: (error) => {
      if (isApiError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "OTP verification failed. Please try again.";

        setError(errorMessage);
      }
    },
  });
};
