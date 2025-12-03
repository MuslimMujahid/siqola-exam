"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isApiError } from "@/lib/api/client";
import { useAuthStore } from "@/modules/auth/store/auth";
import { useInviteUser } from "@/modules/institution/api/invitation";
import { UserRole } from "../entities";

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUserDialog({
  open,
  onOpenChange,
}: InviteUserDialogProps) {
  const { user } = useAuthStore();
  const institutionId = user?.memberships?.[0]?.institution?.id || "";

  const { mutate: inviteUser, isPending: isInvitingUser } = useInviteUser();

  const form = useForm({
    defaultValues: {
      email: "",
      role: "" as UserRole,
    },
    onSubmit: async ({ value }) => {
      inviteUser(
        { ...value, institutionId },
        {
          onSuccess: () => {
            toast.success("Undangan berhasil dikirim!");
            onOpenChange(false);
            form.reset();
          },
          onError: (error: unknown) => {
            let displayMessage = "Terjadi kesalahan. Silakan coba lagi.";

            if (isApiError(error)) {
              displayMessage = error?.response?.data?.message || displayMessage;

              if (
                displayMessage
                  .toLocaleLowerCase()
                  .includes("already has membership")
              ) {
                displayMessage =
                  "Pengguna sudah terdaftar atau sedang menunggu persetujuan";
              }
            }

            toast.error(displayMessage);
          },
        }
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Undang Pengguna</DialogTitle>
          <DialogDescription>
            Masukkan email dan peran pengguna yang ingin diundang. Undangan akan
            dikirim melalui email.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-4 py-4">
            <form.Field name="email">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id={field.name}
                    type="email"
                    placeholder="user@example.com"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="role">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Peran</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as "EXAMINER" | "EXAMINEE")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih peran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EXAMINER">Penguji</SelectItem>
                      <SelectItem value="EXAMINEE">Peserta</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isInvitingUser}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isInvitingUser}>
              {isInvitingUser ? "Mengirim..." : "Kirim Undangan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
