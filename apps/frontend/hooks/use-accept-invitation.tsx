import { useMutation } from "@tanstack/react-query";
import { invitationsApi, AcceptInvitationRequest } from "@/lib/api/invitations";
import { isApiError } from "@/lib/api/client";
import { toast } from "sonner";

export function useAcceptInvitation(token: string) {
  return useMutation({
    mutationFn: (data?: AcceptInvitationRequest) =>
      invitationsApi.acceptInvitation(token, data),
    onSuccess: () => {
      toast.success("Undangan berhasil diterima");
    },
    onError: (error: unknown) => {
      if (isApiError(error)) {
        toast.error(error.response?.data?.message || "Gagal menerima undangan");
      } else {
        toast.error("Terjadi kesalahan");
      }
    },
  });
}
