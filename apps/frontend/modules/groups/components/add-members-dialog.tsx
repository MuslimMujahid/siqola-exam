"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";
import { Search, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { usersQueryOptions } from "@/modules/users/api/users";
import { userRole } from "@/modules/users/entities";
import { useAddBatchGroupMembers } from "../api/groups";

interface AddMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  institutionId?: string;
}

export function AddMembersDialog({
  open,
  onOpenChange,
  groupId,
  institutionId,
}: AddMembersDialogProps) {
  const [availableUsersSearch, setAvailableUsersSearch] = React.useState("");
  const [selectedNewMembers, setSelectedNewMembers] = React.useState<string[]>(
    []
  );

  const debouncedAvailableUsersSearch = useDebounce(availableUsersSearch, 300);

  // Fetch available users (not in group) for adding
  const { data: availableUsersData, isLoading: isLoadingAvailableUsers } =
    useQuery({
      ...usersQueryOptions({
        page: 1,
        limit: 50,
        search: debouncedAvailableUsersSearch,
        institutionId,
        excludeGroupId: groupId,
        role: userRole.EXAMINEE,
      }),
      enabled: open && !!institutionId,
    });

  // Manage group members
  const { mutate: addMembers, isPending: isAddingMembers } =
    useAddBatchGroupMembers();

  // Available users are already filtered by the backend
  const availableUsers = availableUsersData?.data || [];

  const toggleNewMember = (userId: string) => {
    setSelectedNewMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleClearSelection = () => {
    setSelectedNewMembers([]);
    setAvailableUsersSearch("");
  };

  const handleAddMembers = async () => {
    if (selectedNewMembers.length === 0) return;

    addMembers(
      {
        groupId,
        userIds: selectedNewMembers,
      },
      {
        onSuccess: () => {
          setSelectedNewMembers([]);
          setAvailableUsersSearch("");
          onOpenChange(false);
        },
        onError: (error) => {
          console.error("Failed to add members:", error);
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle>Tambah Anggota ke Grup</AlertDialogTitle>
          <AlertDialogDescription>
            Pilih pengguna yang ingin ditambahkan ke grup ini.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4 py-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari pengguna..."
              value={availableUsersSearch}
              onChange={(e) => setAvailableUsersSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Selected count */}
          {selectedNewMembers.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedNewMembers.length} pengguna dipilih
              </span>
              <Button size="sm" variant="ghost" onClick={handleClearSelection}>
                <X className="w-4 h-4 mr-2" />
                Hapus Pilihan
              </Button>
            </div>
          )}

          {/* Users list */}
          <div className="flex-1 overflow-y-auto border rounded-lg">
            {isLoadingAvailableUsers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : availableUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {availableUsersSearch
                  ? "Tidak ada pengguna yang ditemukan"
                  : "Semua pengguna sudah menjadi anggota grup ini"}
              </div>
            ) : (
              <div className="divide-y">
                {availableUsers.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={selectedNewMembers.includes(user.id)}
                      onCheckedChange={() => toggleNewMember(user.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{user.fullName}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClearSelection}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAddMembers}
            disabled={selectedNewMembers.length === 0 || isAddingMembers}
          >
            {isAddingMembers ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menambahkan...
              </>
            ) : (
              `Tambahkan ${selectedNewMembers.length} Anggota`
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
