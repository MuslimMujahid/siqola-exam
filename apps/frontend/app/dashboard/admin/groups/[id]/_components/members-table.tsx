"use client";

import React from "react";
import { Trash2, MoreVertical, Search, Filter, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, Column } from "@/components/ui/data-table";
import { UserStatus } from "@/lib/entities/users";

interface Member {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  lastLogin: string;
}

interface MembersTableProps {
  members: Member[];
  isLoading: boolean;
  selectedMembers: string[];
  onToggleMember: (id: string) => void;
  onToggleAll: () => void;
  onRemoveMember: (id: string) => void;
  onRemoveBatch: () => void;
  isRemovingMember: boolean;
  isRemovingBatch: boolean;
  // Search and filter
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: "all" | "ACTIVE" | "SUSPENDED" | "PENDING";
  onStatusFilterChange: (
    status: "all" | "ACTIVE" | "SUSPENDED" | "PENDING"
  ) => void;
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function MembersTable({
  members,
  isLoading,
  selectedMembers,
  onToggleMember,
  onToggleAll,
  onRemoveMember,
  onRemoveBatch,
  isRemovingMember,
  isRemovingBatch,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: MembersTableProps) {
  const isAllSelected = React.useMemo(
    () =>
      members.length > 0 &&
      members.every((m) => selectedMembers.includes(m.id)),
    [members, selectedMembers]
  );

  const columns: Column<Member>[] = React.useMemo(
    () => [
      {
        key: "name",
        header: "Nama",
        cell: (member) => <span className="font-medium">{member.name}</span>,
      },
      {
        key: "email",
        header: "Email",
        cell: (member) => (
          <span className="text-muted-foreground">{member.email}</span>
        ),
      },
      {
        key: "status",
        header: "Status",
        cell: (member) => (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              member.status === "ACTIVE"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {member.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
          </span>
        ),
      },
      {
        key: "lastLogin",
        header: "Login Terakhir",
        cell: (member) => (
          <span className="text-muted-foreground text-sm">
            {member.lastLogin}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Aksi",
        className: "w-[70px]",
        cell: (member) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                Lihat Profil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={() => onRemoveMember(member.id)}
                disabled={isRemovingMember}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus dari Grup
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onRemoveMember, isRemovingMember]
  );

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari anggota berdasarkan nama atau email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="ACTIVE">Aktif</SelectItem>
            <SelectItem value="SUSPENDED">Ditangguhkan</SelectItem>
            <SelectItem value="PENDING">Menunggu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Batch Actions */}
      {selectedMembers.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedMembers.length} anggota dipilih
          </span>
          <Button
            size="sm"
            variant="destructive"
            onClick={onRemoveBatch}
            disabled={isRemovingBatch}
          >
            {isRemovingBatch ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Hapus dari Grup
          </Button>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        data={members}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Tidak ada anggota yang ditemukan"
        getRowKey={(member) => member.id}
        selectable
        selectedItems={selectedMembers}
        onSelectItem={onToggleMember}
        onSelectAll={onToggleAll}
        isAllSelected={isAllSelected}
      />

      {/* Pagination */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
