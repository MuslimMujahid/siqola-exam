"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { useCreateGroup } from "@/hooks";
import { GroupForm, GroupFormData } from "../_components/group-form";

export default function CreateGroupPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  // Get institution ID from user's first membership
  const institutionId = user?.memberships?.[0]?.institution?.id;

  // Create group
  const { createGroup: handleCreateGroup, isLoading: isLoadingCreateGroup } =
    useCreateGroup();

  const handleSubmit = async (data: GroupFormData) => {
    if (!institutionId) {
      console.error("No institution ID found");
      return;
    }

    handleCreateGroup({
      institutionId,
      name: data.name,
      description: data.description || undefined,
      memberIds: data.memberIds.length > 0 ? data.memberIds : undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Buat Grup Baru</h2>
          <p className="text-muted-foreground mt-1">
            Buat grup untuk mengorganisir peserta ujian
          </p>
        </div>
      </div>

      <GroupForm
        onSubmit={handleSubmit}
        isLoading={isLoadingCreateGroup}
        submitLabel="Simpan Grup"
        onCancel={() => router.back()}
      />
    </div>
  );
}
