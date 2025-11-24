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
        let message =
          error.response?.data?.message || "Gagal mengirim undangan";

        if (message.includes("already has membership")) {
          message = "Pengguna sudah terdaftar di institusi ini";
        }

        toast.error(message);
      } else {
        toast.error("Terjadi kesalahan");
      }
    },
  });
}
