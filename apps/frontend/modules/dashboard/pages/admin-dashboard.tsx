"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  FileText,
  Activity,
  CheckCircle,
  Clock,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ComingSoonWrapper } from "@/components/ui/coming-soon-wrapper";
import { useAuthStore } from "@/modules/auth/store/auth";
import { institutionStatsQueryOptions } from "@/modules/institution/api/institution";
import { InviteUserDialog } from "@/modules/users/components/invite-user-dialog";
import { InstitutionProfileCard } from "../components/institution-profile-card";
import { RecentActivityFeed } from "../components/recent-activity-feed";
import { RecentUsersSection } from "../components/recent-users-section";
import { SystemNotifications } from "../components/system-notifications";

const mockRecentActivity = [
  {
    id: 1,
    type: "exam_created",
    message: "Dr. Smith membuat ujian baru: Ujian Matematika Akhir",
    time: "10 menit yang lalu",
    icon: FileText,
  },
  {
    id: 2,
    type: "submission",
    message: "Sarah Johnson mengumpulkan Ujian Fisika Tengah Semester",
    time: "25 menit yang lalu",
    icon: CheckCircle,
  },
  {
    id: 3,
    type: "user_added",
    message: "New examiner added: Dr. Michael Brown",
    time: "1 jam yang lalu",
    icon: UserPlus,
  },
  {
    id: 4,
    type: "exam_published",
    message: "Kuis Kimia dipublikasikan oleh Prof. Lee",
    time: "2 jam yang lalu",
    icon: FileText,
  },
  {
    id: 5,
    type: "exam_opened",
    message: "UTS Matematika dimulai",
    time: "3 jam yang lalu",
    icon: Activity,
  },
  {
    id: 6,
    type: "submission",
    message: "John Doe mengumpulkan Tugas Biologi",
    time: "4 jam yang lalu",
    icon: CheckCircle,
  },
  {
    id: 7,
    type: "exam_closed",
    message: "Ujian literatur bahasa Inggris ditutup",
    time: "5 jam yang lalu",
    icon: Clock,
  },
];

const mockSystemNotifications = [
  {
    id: 1,
    type: "success" as const,
    message: "Pengguna berhasil diundang",
    time: "5 menit yang lalu",
  },
  {
    id: 2,
    type: "info" as const,
    message: "Dr. Smith membuat ujian baru: Ujian Fisika Akhir",
    time: "30 menit yang lalu",
  },
  {
    id: 3,
    type: "warning" as const,
    message: "Ada 12 pengumpulan yang menunggu penilaian",
    time: "1 jam yang lalu",
  },
  {
    id: 4,
    type: "reminder" as const,
    message: "UTS Matematika dimulai dalam 2 jam",
    time: "2 jam yang lalu",
  },
];

export function AdminDashboard() {
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);

  const activeInstitution = useAuthStore((state) => state.institution);
  const institutionId = activeInstitution?.id;

  const { data: stats, isLoading: isLoadingStats } = useQuery(
    institutionStatsQueryOptions(institutionId!)
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Dashboard Institusi
        </h2>
        <p className="text-muted-foreground mt-1">
          Kelola institusi Anda, pengguna, dan pantau aktivitas
        </p>
      </div>

      <InviteUserDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {isLoadingStats ? "..." : (stats?.totalExaminers ?? 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Penguji</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {isLoadingStats ? "..." : (stats?.totalExaminees ?? 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Peserta</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {isLoadingStats ? "..." : (stats?.totalExams ?? 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Ujian
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <Card className="border-border/50 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">5</p>
                      <p className="text-xs text-muted-foreground">
                        Ujian Berlangsung
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            <Button onClick={() => setInviteDialogOpen(true)}>
              <Mail className="w-4 h-4 mr-2" />
              Undang Pengguna
            </Button>
          </motion.div>

          {/* Recent Users */}
          <RecentUsersSection />

          {/* Recent Activity Feed */}
          <ComingSoonWrapper>
            <RecentActivityFeed activities={mockRecentActivity} />
          </ComingSoonWrapper>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Institution Profile */}
          <InstitutionProfileCard />

          {/* System Notifications */}
          <ComingSoonWrapper>
            <SystemNotifications notifications={mockSystemNotifications} />
          </ComingSoonWrapper>
        </div>
      </div>
    </div>
  );
}
