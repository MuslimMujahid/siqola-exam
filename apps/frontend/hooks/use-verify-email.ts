import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { verifyEmail, resendVerificationEmail } from "@/lib/api/auth";

/**
 * Custom hook for handling email verification
 * Provides verification and resend mutations
 */
export function useVerifyEmail() {
  const verifyMutation = useMutation({
    mutationFn: (token: string) => verifyEmail(token),
  });

  const resendMutation = useMutation({
    mutationFn: resendVerificationEmail,
  });

  const verify = useCallback(
    async (token: string) => {
      return verifyMutation.mutateAsync(token);
    },
    [verifyMutation]
  );

  const resend = useCallback(
    async (params: { email?: string; token?: string }) => {
      return resendMutation.mutateAsync(params);
    },
    [resendMutation]
  );

  return {
    verify,
    resend,
    isVerifying: verifyMutation.isPending,
    isResending: resendMutation.isPending,
    verifyError: verifyMutation.error,
    resendError: resendMutation.error,
    isVerifySuccess: verifyMutation.isSuccess,
    isResendSuccess: resendMutation.isSuccess,
    verifyData: verifyMutation.data,
    resendData: resendMutation.data,
    resetVerify: verifyMutation.reset,
    resetResend: resendMutation.reset,
  };
}
