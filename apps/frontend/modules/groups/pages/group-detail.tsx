"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Trash2,
  UserPlus,
  AlertTriangle,
  Calendar,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usersQueryOptions } from "@/modules/users/api/users";
import { userRole, type UserStatus } from "@/modules/users/entities";
import { useDebounce } from "@/hooks/use-debounce";
import {
  groupQueryOptions,
  useDeleteGroup,
  useRemoveGroupMember,
  useRemoveBatchGroupMembers,
} from "../api/groups";
import { AddMembersDialog } from "../components/add-members-dialog";
import { MembersTable } from "../components/members-table";

export type GroupDetailProps = {
  params: Promise<{ id: string }>;
};

const ITEMS_PER_PAGE = 10;

export function GroupDetail({ params }: GroupDetailProps) {
  const { id: groupId } = React.use(params);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<UserStatus | "all">(
    "all"
  );
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAddMembersOpen, setIsAddMembersOpen] = React.useState(false);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch group data
  const {
    data: groupData,
    isLoading: isLoadingGroup,
    error: groupError,
  } = useQuery(groupQueryOptions({ id: groupId }));

  // Fetch group members
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    ...usersQueryOptions({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      groupId,
      search: debouncedSearchQuery,
      status: statusFilter === "all" ? undefined : statusFilter,
      role: userRole.EXAMINEE,
    }),
    enabled: !!groupId,
  });

  // Manage group
  const { mutate: handleDeleteGroup, isPending: isDeletingGroup } =
    useDeleteGroup();
  const { mutate: removeMembers, isPending: isRemovingMembers } =
    useRemoveBatchGroupMembers();
  const { mutate: removeSingleMember, isPending: isRemovingMember } =
    useRemoveGroupMember();

  // Transform members data
  const institutionId = groupData?.institutionId;
  const usersDataList = usersData?.data;
  const members = React.useMemo(() => {
    if (!usersDataList) return [];
    return usersDataList.reduce(
      (membersData, user) => {
        const membership = user.memberships?.find(
          (m) => m.institution.id === institutionId
        );

        if (!membership) return membersData;
        return [
          ...membersData,
          {
            id: user.id,
            name: user.fullName,
            email: user.email,
            status: membership.status,
            lastLogin: user.lastLogin
              ? new Date(user.lastLogin).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Belum pernah login",
          },
        ];
      },
      [] as {
        id: string;
        name: string;
        email: string;
        status: UserStatus;
        lastLogin: string;
      }[]
    );
  }, [usersDataList, institutionId]);

  const totalPages = usersData?.meta.totalPages || 1;
  const totalMembers = usersData?.meta.total || 0;

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (members.every((m) => selectedMembers.includes(m.id))) {
      setSelectedMembers((prev) =>
        prev.filter((id) => !members.find((m) => m.id === id))
      );
    } else {
      setSelectedMembers((prev) => [
        ...new Set([...prev, ...members.map((m) => m.id)]),
      ]);
    }
  };

  const handleRemoveMembers = () => {
    removeMembers(
      {
        groupId,
        userIds: selectedMembers,
      },
      {
        onSuccess: () => {
          setSelectedMembers([]);
        },
      }
    );
  };

  const handleRemoveSingleMember = (userId: string) => {
    removeSingleMember({ groupId, userId });
  };

  if (isLoadingGroup) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (groupError || !groupData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-destructive mb-4">
          Gagal memuat data grup. Silakan coba lagi.
        </p>
        <Button onClick={() => router.back()}>Kembali</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {groupData.name}
            </h2>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/dashboard/admin/groups/${groupId}/edit`)
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Grup
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteGroup(groupId)}
            disabled={isDeletingGroup}
          >
            {isDeletingGroup ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Hapus Grup
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Delete Warning */}
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Perhatian</AlertTitle>
          <AlertDescription>
            Menghapus grup tidak akan menghapus data peserta atau ujian.
          </AlertDescription>
        </Alert>

        {/* Group Info */}
        <Card className="border-border/50 overflow-hidden">
          <CardHeader>
            <CardTitle>Informasi Grup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Description */}
              <div className="md:col-span-2">
                <div className="p-4 rounded-lg border border-border/50 bg-muted/20 h-full">
                  <p className="text-sm font-medium text-muted-foreground">
                    Deskripsi
                  </p>
                  <p className="text-sm leading-relaxed pt-2">
                    {groupData.description || (
                      <span className="text-muted-foreground italic">
                        Tidak ada deskripsi
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                {/* Member Count */}
                <div className="p-4 rounded-lg bg-linear-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                      Total Anggota
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    {totalMembers}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    peserta terdaftar
                  </p>
                </div>

                {/* Created Date */}
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/20">
                  <div className="p-2 rounded-md bg-background border border-border/50">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Tanggal dibuat
                    </p>
                    <p className="text-sm font-medium">
                      {new Date(groupData.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Member List */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Daftar Anggota</CardTitle>
              <Button size="sm" onClick={() => setIsAddMembersOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Tambah Anggota
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <MembersTable
              members={members}
              isLoading={isLoadingUsers}
              selectedMembers={selectedMembers}
              onToggleMember={toggleMember}
              onToggleAll={toggleAll}
              onRemoveMember={handleRemoveSingleMember}
              onRemoveBatch={handleRemoveMembers}
              isRemovingMember={isRemovingMember}
              isRemovingBatch={isRemovingMembers}
              searchQuery={searchQuery}
              onSearchChange={(query) => {
                setSearchQuery(query);
                setCurrentPage(1);
              }}
              statusFilter={statusFilter}
              onStatusFilterChange={(val) => setStatusFilter(val)}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalMembers}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Members Dialog */}
      <AddMembersDialog
        open={isAddMembersOpen}
        onOpenChange={setIsAddMembersOpen}
        groupId={groupId}
        institutionId={groupData.institutionId}
      />
    </div>
  );
}
