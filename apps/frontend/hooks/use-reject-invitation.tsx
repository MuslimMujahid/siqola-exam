import { useMutation } from "@tanstack/react-query";
import { invitationsApi } from "@/lib/api/invitations";
import { isApiError } from "@/lib/api/client";
import { toast } from "sonner";

export function useRejectInvitation(token: string) {
  return useMutation({
    mutationFn: () => invitationsApi.rejectInvitation(token),
    onSuccess: () => {
      toast.success("Undangan berhasil ditolak");
    },
    onError: (error: unknown) => {
      if (isApiError(error)) {
        toast.error(error.response?.data?.message || "Gagal menolak undangan");
      } else {
        toast.error("Terjadi kesalahan");
      }
    },
  });
}
