"use client";

import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Search, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { groupsQueryOptions } from "@/lib/query/groups";
import { addGroupMember } from "@/lib/api/groups";
import { useAuthStore } from "@/store/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AddToGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentGroups: string[];
  onSuccess: () => void;
}

export function AddToGroupModal({
  isOpen,
  onClose,
  userId,
  currentGroups,
  onSuccess,
}: AddToGroupModalProps) {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = React.useState("");

  const institutionId = user?.memberships?.[0]?.institution?.id;

  // Fetch available groups
  const { data: groupsData, isLoading } = useQuery(
    groupsQueryOptions({
      institutionId,
      limit: 100,
    })
  );

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: (groupId: string) => addGroupMember(groupId, { userId }),
    onSuccess: () => {
      toast.success("Berhasil menambahkan pengguna ke grup");
      onSuccess();
      onClose();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err.response?.data?.message || "Gagal menambahkan pengguna ke grup"
      );
    },
  });

  const groups = groupsData?.data || [];

  // Filter groups - exclude groups user is already in
  const availableGroups = groups.filter(
    (group) =>
      !currentGroups.includes(group.id) &&
      group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToGroup = (groupId: string) => {
    addMemberMutation.mutate(groupId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah ke Grup</DialogTitle>
          <DialogDescription>
            Pilih grup untuk menambahkan pengguna
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari grup..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Groups List */}
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : availableGroups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery
                  ? "Tidak ada grup yang cocok"
                  : "Tidak ada grup tersedia"}
              </div>
            ) : (
              availableGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{group.name}</p>
                    {group.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {group.description}
                      </p>
                    )}
                    {group._count && (
                      <Badge variant="secondary" className="mt-1">
                        {group._count.groupMembers} anggota
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddToGroup(group.id)}
                    disabled={addMemberMutation.isPending}
                  >
                    {addMemberMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Tambah
                      </>
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
