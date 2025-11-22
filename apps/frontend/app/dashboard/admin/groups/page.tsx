"use client";

import React from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, UserCog, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { useAuthStore } from "@/store/auth";
import { groupsQueryOptions } from "@/lib/query/groups";
import { GroupTable } from "./_components/group-table";

const ITEMS_PER_PAGE = 10;

export default function GroupManagementPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const { user } = useAuthStore();

  // Get institution ID from user's first membership
  const institutionId = user?.memberships?.[0]?.institution?.id;

  // Fetch groups from API
  const {
    data: groupsData,
    isLoading,
    error,
  } = useQuery(
    groupsQueryOptions({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      institutionId,
    })
  );

  // Transform API data to match table format
  const groups = React.useMemo(() => {
    if (!groupsData?.data) return [];
    return groupsData.data.map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description || "",
      memberCount: group._count?.groupMembers || 0,
      createdAt: new Date(group.createdAt).toISOString().split("T")[0],
    }));
  }, [groupsData]);

  // Filter groups by search query
  const filteredGroups = React.useMemo(() => {
    return groups.filter((group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [groups, searchQuery]);

  const totalPages = groupsData?.meta?.totalPages || 1;
  const totalItems = groupsData?.meta?.total || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kelola Grup</h2>
          <p className="text-muted-foreground mt-1">
            Buat dan kelola grup untuk mengorganisir pengguna
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/groups/create">
            <UserCog className="w-4 h-4 mr-2" />
            Buat Grup
          </Link>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-border/50">
          <CardContent className="pt-6 space-y-4">
            {/* Search */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari grup berdasarkan nama..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">
                  Gagal memuat data grup. Silakan coba lagi.
                </p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredGroups.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Tidak ada grup yang ditemukan."
                    : "Tidak ada grup yang ditemukan. Buat grup untuk memulai."}
                </p>
                {!searchQuery && (
                  <Button asChild>
                    <Link href="/dashboard/admin/groups/create">
                      <UserCog className="w-4 h-4 mr-2" />
                      Buat Grup
                    </Link>
                  </Button>
                )}
              </div>
            )}

            {/* Groups Table */}
            {!isLoading && !error && filteredGroups.length > 0 && (
              <>
                <GroupTable groups={filteredGroups} />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
