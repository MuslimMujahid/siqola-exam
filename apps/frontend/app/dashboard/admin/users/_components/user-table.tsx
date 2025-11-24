"use client";

import * as React from "react";
import Link from "next/link";
import { MoreVertical, Eye, Ban, CheckCircle, Trash2 } from "lucide-react";
import { useUpdateMembershipStatus } from "@/hooks/use-update-membership-status";
import { useDeleteUser } from "@/hooks/use-delete-user";
import { useConfirm } from "@/hooks/use-confirm";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, Column } from "@/components/ui/data-table";
import { userStatus } from "@/lib/entities/users";

interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  memberships?: Array<{
    id: string;
    status: string;
    institution: {
      id: string;
      name: string;
    };
  }>;
  groupMembers?: Array<{
    group: {
      id: string;
      name: string;
    };
  }>;
}

interface UserTableProps {
  users: User[];
  showGroups?: boolean;
  isLoading?: boolean;
}

export function UserTable({
  users,
  showGroups = true,
  isLoading = false,
}: UserTableProps) {
  const { user: currentUser } = useAuthStore();
  const updateMembershipStatus = useUpdateMembershipStatus();
  const deleteUser = useDeleteUser();
  const { confirm, ConfirmDialog } = useConfirm();

  const institutionId = currentUser?.memberships?.[0]?.institution?.id;

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "active":
        return (
          <Badge
            variant="default"
            className="bg-green-500/10 text-green-600 hover:bg-green-500/20"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Aktif
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="destructive">
            <Ban className="w-3 h-3 mr-1" />
            Ditangguhkan
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleToggleStatus = React.useCallback(
    async (user: User) => {
      const membership = user.memberships?.[0];
      if (!membership || !institutionId) return;

      const currentStatus = membership.status.toUpperCase();
      const newStatus =
        currentStatus === userStatus.ACTIVE
          ? userStatus.SUSPENDED
          : userStatus.ACTIVE;
      const actionText =
        newStatus === userStatus.SUSPENDED ? "tangguhkan" : "aktifkan";

      let confirmed = true;
      if (newStatus === userStatus.SUSPENDED) {
        confirmed = await confirm({
          title: `${actionText === "tangguhkan" ? "Tangguhkan" : "Aktifkan"} pengguna`,
          description: `Pengguna tidak akan dapat mengakses institusi jika ditangguhkan. Apakah Anda yakin ingin ${actionText} ${user.fullName}?.`,
          variant:
            newStatus === userStatus.SUSPENDED ? "destructive" : "default",
        });
      }

      if (confirmed) {
        try {
          await updateMembershipStatus.mutateAsync({
            userId: user.id,
            institutionId,
            status: newStatus,
          });
          toast.success(`Berhasil ${actionText} pengguna`);
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : `Gagal ${actionText} pengguna`;
          toast.error(errorMessage);
        }
      }
    },
    [confirm, institutionId, updateMembershipStatus]
  );

  const handleDeleteUser = React.useCallback(
    async (user: User) => {
      const confirmed = await confirm({
        title: "Hapus pengguna",
        description: `Apakah Anda yakin ingin menghapus ${user.fullName}? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: "Hapus",
        variant: "destructive",
      });

      if (confirmed) {
        try {
          await deleteUser.mutateAsync(user.id);
          toast.success("Berhasil menghapus pengguna");
        } catch {
          toast.error("Gagal menghapus pengguna");
        }
      }
    },
    [confirm, deleteUser]
  );

  const columns: Column<User>[] = React.useMemo(() => {
    const baseColumns: Column<User>[] = [
      {
        key: "name",
        header: "Nama",
        cell: (user) => <span className="font-medium">{user.fullName}</span>,
      },
      {
        key: "email",
        header: "Email",
        cell: (user) => (
          <span className="text-muted-foreground">{user.email}</span>
        ),
      },
    ];

    if (showGroups) {
      baseColumns.push({
        key: "groups",
        header: "Grup",
        cell: (user) => (
          <div className="flex flex-wrap gap-1">
            {user.groupMembers && user.groupMembers.length > 0 ? (
              user.groupMembers.map((gm) => (
                <Badge
                  key={gm.group.id}
                  variant="secondary"
                  className="text-xs"
                >
                  {gm.group.name}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">
                Tidak ada grup
              </span>
            )}
          </div>
        ),
      });
    }

    baseColumns.push(
      {
        key: "status",
        header: "Status",
        cell: (user) =>
          getStatusBadge(user.memberships?.[0]?.status || "active"),
      },
      {
        key: "createdAt",
        header: "Dibuat",
        cell: (user) => (
          <span className="text-muted-foreground">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Aksi",
        className: "w-[70px]",
        cell: (user) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/admin/users/${user.id}`}
                  className="cursor-pointer"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Lihat Pengguna
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleToggleStatus(user)}
                disabled={updateMembershipStatus.isPending}
              >
                {user.memberships?.[0]?.status?.toUpperCase() ===
                "SUSPENDED" ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aktifkan
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4 mr-2" />
                    Tangguhkan
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={() => handleDeleteUser(user)}
                disabled={deleteUser.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }
    );

    return baseColumns;
  }, [
    showGroups,
    updateMembershipStatus.isPending,
    deleteUser.isPending,
    handleToggleStatus,
    handleDeleteUser,
  ]);

  return (
    <>
      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Tidak ada pengguna yang ditemukan"
        getRowKey={(user) => user.id}
      />
      <ConfirmDialog />
    </>
  );
}
