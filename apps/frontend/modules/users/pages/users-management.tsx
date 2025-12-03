"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SearchIcon, MailIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { useAuthStore } from "@/modules/auth/store/auth";
import { usersQueryOptions } from "../api/users";
import { InviteUserDialog } from "../components/invite-user-dialog";
import { UsersTable } from "../components/users-table";
import { userRole } from "../entities";

const ITEMS_PER_PAGE = 10;

export default function UsersManagement() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState("examiners");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [groupFilter, setGroupFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);

  // Debounce search query to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Get institution ID from user memberships
  const institutionId = user?.memberships?.[0]?.institution?.id;

  // Determine role filter based on active tab
  const roleFilter =
    activeTab === "examiners" ? userRole.EXAMINER : userRole.EXAMINEE;

  // Build query parameters
  const queryParams = React.useMemo(() => {
    const params: Record<string, string | number> = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      role: roleFilter,
    };

    if (institutionId) {
      params.institutionId = institutionId;
    }

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (statusFilter !== "all") {
      params.status = statusFilter.toUpperCase();
    }

    if (groupFilter !== "all" && activeTab === "examinees") {
      params.groupId = groupFilter;
    }

    return params;
  }, [
    currentPage,
    roleFilter,
    institutionId,
    debouncedSearch,
    statusFilter,
    groupFilter,
    activeTab,
  ]);

  // Fetch users from API
  const { data: usersData, isLoading } = useQuery(
    usersQueryOptions(queryParams)
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    setSearchQuery("");
    setStatusFilter("all");
    setGroupFilter("all");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleGroupFilterChange = (value: string) => {
    setGroupFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Extract data from response
  const users = usersData?.data || [];
  const totalUsers = usersData?.meta?.total || 0;
  const totalPages = usersData?.meta?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kelola Pengguna</h2>
          <p className="text-muted-foreground mt-1">
            Lihat dan kelola semua pengguna di institusi Anda
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setInviteDialogOpen(true)}>
            <MailIcon className="w-4 h-4 mr-2" />
            Undang Pengguna
          </Button>
        </div>
      </div>

      <InviteUserDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-4">
                <TabsTrigger value="examiners">
                  Penguji {activeTab === "examiners" && `(${totalUsers})`}
                </TabsTrigger>
                <TabsTrigger value="examinees">
                  Peserta {activeTab === "examinees" && `(${totalUsers})`}
                </TabsTrigger>
              </TabsList>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-2">
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari berdasarkan nama atau email..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="suspended">Ditangguhkan</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                  </SelectContent>
                </Select>
                {activeTab === "examinees" && (
                  <Select
                    value={groupFilter}
                    onValueChange={handleGroupFilterChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: Fetch and display groups */}
                      <SelectItem value="all">Semua Grup</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <TabsContent value="examiners" className="space-y-4">
                {!isLoading && users.length === 0 ? (
                  <p className="text-muted-foreground mb-4 text-center py-12">
                    Penguji tidak ditemukan.
                  </p>
                ) : (
                  <>
                    <UsersTable
                      users={users}
                      showGroups={false}
                      isLoading={isLoading}
                    />
                    {!isLoading && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalUsers}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                      />
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="examinees" className="space-y-4">
                {!isLoading && users.length === 0 ? (
                  <p className="text-muted-foreground mb-4 text-center py-12">
                    Peserta tidak ditemukan.
                  </p>
                ) : (
                  <>
                    <UsersTable
                      users={users}
                      showGroups={true}
                      isLoading={isLoading}
                    />
                    {!isLoading && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalUsers}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                      />
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
