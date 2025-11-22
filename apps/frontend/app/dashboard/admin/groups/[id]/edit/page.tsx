"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useUpdateGroup, useManageGroupMembers } from "@/hooks";
import { groupQueryOptions } from "@/lib/query/groups";
import { usersQueryOptions } from "@/lib/query/users";
import { userRole } from "@/lib/entities/users";
import { GroupForm, GroupFormData } from "../../_components/group-form";

export default function EditGroupPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;

  // Fetch group data
  const { data: groupData, isLoading: isLoadingGroup } = useQuery({
    ...groupQueryOptions({ id: groupId }),
  });

  // Fetch all group members (no pagination needed here, form handles it)
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    ...usersQueryOptions({
      groupId,
      role: userRole.EXAMINEE,
    }),
    enabled: !!groupId,
  });

  // Update group
  const { updateGroup, isLoading: isUpdatingGroup } = useUpdateGroup(groupId);
  const {
    addMembers,
    removeMembers,
    isLoading: isManagingMembers,
  } = useManageGroupMembers(groupId);

  const handleSubmit = async (data: GroupFormData) => {
    if (!usersData) return;

    // Update group basic info
    await updateGroup({
      name: data.name,
      description: data.description || undefined,
    });

    // Calculate members to add and remove
    const currentMemberIds = usersData.data?.map((m) => m.id) || [];
    const newMemberIds = data.memberIds;

    const membersToAdd = newMemberIds.filter(
      (id) => !currentMemberIds.includes(id)
    );
    const membersToRemove = currentMemberIds.filter(
      (id) => !newMemberIds.includes(id)
    );

    // Add new members
    if (membersToAdd.length > 0) {
      await addMembers(membersToAdd);
    }

    // Remove members
    if (membersToRemove.length > 0) {
      await removeMembers(membersToRemove);
    }
  };

  if (isLoadingUsers || isLoadingGroup) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!usersData || !groupData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Grup tidak ditemukan</p>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/admin/groups")}
          className="mt-4"
        >
          Kembali ke Daftar Grup
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Grup</h2>
          <p className="text-muted-foreground mt-1">
            Perbarui informasi dan anggota grup
          </p>
        </div>
      </div>

      <GroupForm
        initialData={{
          name: groupData.name,
          description: groupData.description || "",
          memberIds: usersData.data?.map((m) => m.id) || [],
        }}
        onSubmit={handleSubmit}
        isLoading={isUpdatingGroup || isManagingMembers}
        submitLabel="Perbarui Grup"
        onCancel={() => router.back()}
      />
    </div>
  );
}
