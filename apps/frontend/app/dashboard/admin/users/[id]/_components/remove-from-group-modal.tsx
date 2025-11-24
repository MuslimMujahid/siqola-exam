"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { removeGroupMember } from "@/lib/api/groups";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RemoveFromGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  groupId: string;
  groupName: string;
  onSuccess: () => void;
}

export function RemoveFromGroupModal({
  isOpen,
  onClose,
  userId,
  groupId,
  groupName,
  onSuccess,
}: RemoveFromGroupModalProps) {
  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: () => {
      return removeGroupMember(groupId, userId);
    },
    onSuccess: () => {
      toast.success("Berhasil mengeluarkan pengguna dari grup");
      onSuccess();
      onClose();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err.response?.data?.message || "Gagal mengeluarkan pengguna dari grup"
      );
    },
  });

  const handleRemove = () => {
    removeMemberMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Keluarkan dari Grup</DialogTitle>
              <DialogDescription>
                Tindakan ini tidak dapat dibatalkan
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Apakah Anda yakin ingin mengeluarkan pengguna dari grup{" "}
            <span className="font-semibold text-foreground">{groupName}</span>?
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={removeMemberMutation.isPending}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemove}
            disabled={removeMemberMutation.isPending}
          >
            {removeMemberMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Mengeluarkan...
              </>
            ) : (
              "Keluarkan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
