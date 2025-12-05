"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  SearchIcon,
  PlusIcon,
  FilterIcon,
  CalendarIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { useConfirm } from "@/hooks/use-confirm";
import { Exam, ExamStatus } from "../types/exam";
import { ExamsTable } from "../components/exams-table";
import {
  examsQueryOptions,
  useBulkOperations,
  tagsQueryOptions,
} from "../api/exams";

export function ExamsList() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<ExamStatus | "all">(
    "all"
  );
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [tagSearch, setTagSearch] = React.useState("");

  const { ConfirmDialog, confirm } = useConfirm();
  const bulkOperationsMutation = useBulkOperations();

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedTags = useDebounce(selectedTags, 500);

  // Build query params
  const queryParams = React.useMemo(() => {
    return {
      page,
      limit: 10,
      search: debouncedSearch || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      createdFrom: dateFrom || undefined,
      createdUntil: dateTo || undefined,
      tags: debouncedTags.length > 0 ? debouncedTags : undefined,
    };
  }, [page, debouncedSearch, statusFilter, dateFrom, dateTo, debouncedTags]);

  // Fetch exams from API
  const { data, isLoading, isError } = useQuery(examsQueryOptions(queryParams));

  const exams = React.useMemo(() => data?.data || [], [data?.data]);
  const meta = data?.meta;

  // Fetch available tags from API
  const { data: availableTags = [] } = useQuery(tagsQueryOptions());

  // Filter tags based on search
  const filteredTags = React.useMemo(() => {
    if (!tagSearch) return availableTags;
    return availableTags.filter((tag) =>
      tag.name.toLowerCase().includes(tagSearch.toLowerCase())
    );
  }, [availableTags, tagSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as ExamStatus | "all");
    setPage(1); // Reset to first page on filter change
  };

  const handleCreateExam = () => {
    // TODO: Navigate to create exam page
    console.log("Create exam");
  };

  const handleEditExam = (exam: Exam) => {
    // TODO: Navigate to edit exam page
    console.log("Edit exam:", exam.id);
  };

  const handleDeleteExam = async (exam: Exam) => {
    const confirmed = await confirm({
      title: "Hapus Ujian",
      description: `Apakah Anda yakin ingin menghapus ujian "${exam.title}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Hapus",
      cancelText: "Batal",
    });

    if (confirmed) {
      await bulkOperationsMutation.mutate({
        examIds: [exam.id],
        operation: "DELETE",
      });
    }
  };

  const handlePublishExam = async (exam: Exam) => {
    const confirmed = await confirm({
      title: "Publikasikan Ujian",
      description: `Apakah Anda yakin ingin mempublikasikan ujian "${exam.title}"?`,
      confirmText: "Publikasikan",
      cancelText: "Batal",
    });

    if (confirmed) {
      await bulkOperationsMutation.mutate({
        examIds: [exam.id],
        operation: "PUBLISH",
      });
    }
  };

  const handleUnpublishExam = async (exam: Exam) => {
    const confirmed = await confirm({
      title: "Batalkan Publikasi",
      description: `Apakah Anda yakin ingin membatalkan publikasi ujian "${exam.title}"?`,
      confirmText: "Batalkan",
      cancelText: "Batal",
    });

    if (confirmed) {
      await bulkOperationsMutation.mutate({
        examIds: [exam.id],
        operation: "UNPUBLISH",
      });
    }
  };

  const handleViewExam = (exam: Exam) => {
    // TODO: Navigate to exam detail page
    console.log("View exam:", exam.id);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setSelectedTags([]);
    setPage(1);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1); // Reset to first page on tag change
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
    setPage(1); // Reset to first page on tag removal
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === exams.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(exams.map((exam) => exam.id));
    }
  };

  const handleBulkDelete = async () => {
    const confirmed = await confirm({
      title: "Hapus Ujian",
      description: `Apakah Anda yakin ingin menghapus ${selectedItems.length} ujian? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Hapus",
      cancelText: "Batal",
    });

    if (confirmed) {
      await bulkOperationsMutation.mutate({
        examIds: selectedItems,
        operation: "DELETE",
      });
      setSelectedItems([]);
    }
  };

  const handleBulkPublish = async () => {
    const confirmed = await confirm({
      title: "Publikasikan Ujian",
      description: `Apakah Anda yakin ingin mempublikasikan ${selectedItems.length} ujian?`,
      confirmText: "Publikasikan",
      cancelText: "Batal",
    });

    if (confirmed) {
      await bulkOperationsMutation.mutate({
        examIds: selectedItems,
        operation: "PUBLISH",
      });
      setSelectedItems([]);
    }
  };

  const handleBulkUnpublish = async () => {
    const confirmed = await confirm({
      title: "Batalkan Publikasi",
      description: `Apakah Anda yakin ingin membatalkan publikasi ${selectedItems.length} ujian?`,
      confirmText: "Batalkan",
      cancelText: "Batal",
    });

    if (confirmed) {
      await bulkOperationsMutation.mutate({
        examIds: selectedItems,
        operation: "UNPUBLISH",
      });
      setSelectedItems([]);
    }
  };

  // Check bulk action availability
  const selectedExams = React.useMemo(() => {
    return exams.filter((exam) => selectedItems.includes(exam.id));
  }, [exams, selectedItems]);

  const canBulkPublish = React.useMemo(() => {
    return selectedExams.every((exam) => exam.status === ExamStatus.DRAFT);
  }, [selectedExams]);

  const canBulkUnpublish = React.useMemo(() => {
    return selectedExams.every((exam) => exam.status === ExamStatus.PUBLISHED);
  }, [selectedExams]);

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    dateFrom ||
    dateTo ||
    selectedTags.length > 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Daftar Ujian</h2>
          <p className="text-muted-foreground mt-1">
            Kelola dan pantau semua ujian yang Anda buat
          </p>
        </div>
        <Button onClick={handleCreateExam}>
          <PlusIcon />
          Buat Ujian Baru
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-border/50">
          <CardContent className="pt-6">
            {/* Filters Section */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FilterIcon className="w-4 h-4" />
                Filter
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Search */}
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari ujian..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value={ExamStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={ExamStatus.PUBLISHED}>
                      Dipublikasi
                    </SelectItem>
                    <SelectItem value={ExamStatus.CLOSED}>Ditutup</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date From */}
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-[150px]"
                    placeholder="Dari tanggal"
                  />
                </div>

                {/* Date To */}
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground text-sm">s/d</span>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-[150px]"
                    placeholder="Sampai tanggal"
                  />
                </div>

                {/* Tags Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      Tag
                      {selectedTags.length > 0 && (
                        <Badge
                          variant="default"
                          size="sm"
                          className="ml-2 rounded-full px-1 min-w-5 h-5"
                        >
                          {selectedTags.length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72" align="start">
                    <div className="p-2">
                      <div className="relative">
                        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Cari tag..."
                          value={tagSearch}
                          onChange={(e) => setTagSearch(e.target.value)}
                          className="pl-8 h-8"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="max-h-60 overflow-y-auto">
                      {filteredTags.length === 0 ? (
                        <div className="text-sm text-muted-foreground text-center py-4">
                          Tidak ada tag ditemukan
                        </div>
                      ) : (
                        filteredTags.map((tag) => (
                          <DropdownMenuCheckboxItem
                            key={tag.id}
                            checked={selectedTags.includes(tag.id)}
                            onCheckedChange={() => handleToggleTag(tag.id)}
                            onSelect={(e) => e.preventDefault()}
                          >
                            {tag.name}
                          </DropdownMenuCheckboxItem>
                        ))
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    Hapus Filter
                  </Button>
                )}
              </div>

              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-muted-foreground">
                    Tag dipilih:
                  </span>
                  {selectedTags.map((tagId) => {
                    const tag = availableTags.find((t) => t.id === tagId);
                    return tag ? (
                      <Badge
                        key={tagId}
                        variant="default"
                        size="sm"
                        className="gap-1"
                      >
                        {tag.name}
                        <button
                          onClick={() => handleRemoveTag(tagId)}
                          className="hover:bg-primary/80 rounded-full"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="mb-4 p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedItems.length} ujian dipilih
                </span>
                <div className="flex gap-2">
                  {canBulkPublish && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkPublish}
                    >
                      <PlayIcon />
                      Publikasikan
                    </Button>
                  )}
                  {canBulkUnpublish && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkUnpublish}
                    >
                      <PauseIcon />
                      Batalkan Publikasi
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <TrashIcon />
                    Hapus
                  </Button>
                </div>
              </div>
            )}

            {/* Results Count */}
            {!isLoading && !isError && (
              <div className="mb-4 text-sm text-muted-foreground">
                Menampilkan {exams.length} dari {meta?.total || 0} ujian
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Memuat data ujian...
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-sm text-destructive mb-4">
                    Gagal memuat data ujian. Silakan coba lagi.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    Muat Ulang
                  </Button>
                </div>
              </div>
            )}

            {/* Exams Table */}
            {!isLoading && !isError && (
              <>
                <ExamsTable
                  exams={exams}
                  isLoading={false}
                  onEdit={handleEditExam}
                  onDelete={handleDeleteExam}
                  onPublish={handlePublishExam}
                  onUnpublish={handleUnpublishExam}
                  onView={handleViewExam}
                  selectable
                  selectedItems={selectedItems}
                  onSelectItem={handleSelectItem}
                  onSelectAll={handleSelectAll}
                  isAllSelected={
                    selectedItems.length === exams.length && exams.length > 0
                  }
                />

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <div className="text-sm text-muted-foreground">
                      Halaman {meta.page} dari {meta.totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={meta.page === 1}
                      >
                        Sebelumnya
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={meta.page === meta.totalPages}
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
      <ConfirmDialog />
    </div>
  );
}
