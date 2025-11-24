import { useMutation } from "@tanstack/react-query";
import { invitationsApi, InviteUserRequest } from "@/lib/api/invitations";
import { isApiError } from "@/lib/api/client";
import { toast } from "sonner";

export function useInviteUser(institutionId: string) {
  return useMutation({
    mutationFn: (data: InviteUserRequest) =>
      invitationsApi.inviteUser(data, institutionId),
    onSuccess: () => {
      toast.success("Undangan berhasil dikirim");
    },
    onError: (error: unknown) => {
      if (isApiError(error)) {
        toast.error(error.response?.data?.message || "Gagal mengirim undangan");
      } else {
        toast.error("Terjadi kesalahan");
      }
    },
  });
}
