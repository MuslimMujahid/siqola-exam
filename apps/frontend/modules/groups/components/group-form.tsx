"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Save, Search, Users, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks";
import { useAuthStore } from "@/modules/auth/store/auth";
import { usersQueryOptions } from "@/modules/users/api/users";

const ITEMS_PER_PAGE = 10;

export interface GroupFormData {
  name: string;
  description: string;
  memberIds: string[];
}

interface GroupFormProps {
  initialData?: Partial<GroupFormData>;
  onSubmit: (data: GroupFormData) => void | Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export function GroupForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "Simpan Grup",
  onCancel,
}: GroupFormProps) {
  const { user } = useAuthStore();
  const [groupName, setGroupName] = React.useState(initialData?.name || "");
  const [description, setDescription] = React.useState(
    initialData?.description || ""
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>(
    initialData?.memberIds || []
  );
  const [currentPage, setCurrentPage] = React.useState(1);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Get institution ID from user's first membership
  const institutionId = user?.memberships?.[0]?.institution?.id;

  // Fetch users (examinees) from API
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    ...usersQueryOptions({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      institutionId,
      role: "EXAMINEE",
      search: debouncedSearchQuery,
    }),
    enabled: !!institutionId,
  });

  // Transform API data
  const examinees = React.useMemo(() => {
    if (!usersData?.data) return [];
    return usersData.data.map((user) => {
      const membership = user.memberships?.find(
        (m) => m.institution.id === institutionId
      );

      return {
        id: user.id,
        name: user.fullName,
        email: user.email,
        status: membership?.status.toLowerCase() || "inactive",
      };
    });
  }, [usersData, institutionId]);

  const totalPages = usersData?.meta?.totalPages || 1;
  const totalItems = usersData?.meta?.total || 0;

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (examinees.every((e) => selectedMembers.includes(e.id))) {
      setSelectedMembers((prev) =>
        prev.filter((id) => !examinees.find((e) => e.id === id))
      );
    } else {
      setSelectedMembers((prev) => [
        ...new Set([...prev, ...examinees.map((e) => e.id)]),
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      name: groupName,
      description,
      memberIds: selectedMembers,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Group Info */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Informasi Grup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">
                Nama Grup <span className="text-destructive">*</span>
              </Label>
              <Input
                id="groupName"
                placeholder="Contoh: Kelas 10A, Tahun 2024, Departemen Matematika"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Deskripsi singkat tentang grup ini"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Member Selection */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Pilih Anggota
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedMembers.length} anggota dipilih
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari peserta berdasarkan nama atau email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            {/* Loading State */}
            {isLoadingUsers && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* Member List */}
            {!isLoadingUsers && (
              <div className="border rounded-lg">
                <div className="divide-y">
                  {/* Header with Select All */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-muted/50">
                    <Checkbox
                      checked={
                        examinees.length > 0 &&
                        examinees.every((e) => selectedMembers.includes(e.id))
                      }
                      onCheckedChange={toggleAll}
                    />
                    <span className="text-sm font-medium">Pilih Semua</span>
                  </div>

                  {/* Member Items */}
                  {examinees.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Tidak ada peserta yang ditemukan
                    </div>
                  ) : (
                    examinees.map((examinee) => (
                      <div
                        key={examinee.id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={selectedMembers.includes(examinee.id)}
                          onCheckedChange={() => toggleMember(examinee.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{examinee.name}</div>
                          <div className="text-sm text-muted-foreground truncate">
                            {examinee.email}
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            examinee.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {examinee.status === "active" ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Pagination */}
            {!isLoadingUsers && examinees.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Batal
            </Button>
          )}
          <Button type="submit" disabled={!groupName.trim() || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {submitLabel}
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </form>
  );
}
