"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  FileText,
  Activity,
  Settings,
  Building2,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data - replace with actual API calls
const mockStats = {
  totalExaminers: 24,
  totalExaminees: 386,
  totalExams: 47,
  activeExams: 5,
};

const mockRecentUsers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.j@university.edu",
    role: "Examiner",
    status: "active",
    addedAt: "2 jam yang lalu",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@university.edu",
    role: "Examinee",
    status: "active",
    addedAt: "5 jam yang lalu",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.d@university.edu",
    role: "Examinee",
    status: "active",
    addedAt: "1 hari yang lalu",
  },
  {
    id: 4,
    name: "Prof. Robert Wilson",
    email: "r.wilson@university.edu",
    role: "Examiner",
    status: "suspended",
    addedAt: "2 hari yang lalu",
  },
  {
    id: 5,
    name: "Jessica Martinez",
    email: "j.martinez@university.edu",
    role: "Examinee",
    status: "active",
    addedAt: "3 hari yang lalu",
  },
];

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
    type: "success",
    message: "Pengguna berhasil diundang",
    time: "5 menit yang lalu",
  },
  {
    id: 2,
    type: "info",
    message: "Dr. Smith membuat ujian baru: Ujian Fisika Akhir",
    time: "30 menit yang lalu",
  },
  {
    id: 3,
    type: "warning",
    message: "Ada 12 pengumpulan yang menunggu penilaian",
    time: "1 jam yang lalu",
  },
  {
    id: 4,
    type: "reminder",
    message: "UTS Matematika dimulai dalam 2 jam",
    time: "2 jam yang lalu",
  },
];

const mockInstitution = {
  name: "Universitas ABC",
  logo: null,
  adminName: "Admin John Doe",
  adminEmail: "admin@university.edu",
};

export default function AdminDashboard() {
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
                        {mockStats.totalExaminers}
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
                        {mockStats.totalExaminees}
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
                        {mockStats.totalExams}
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
                      <p className="text-2xl font-bold text-primary">
                        {mockStats.activeExams}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Aktif Sekarang
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
            <Button asChild>
              <Link href="/dashboard/admin/users/add-examiner">
                <UserPlus className="w-4 h-4 mr-2" />
                Tambah Penguji
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/admin/users/add-examinee">
                <UserPlus className="w-4 h-4 mr-2" />
                Tambah Peserta
              </Link>
            </Button>
          </motion.div>

          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Manajemen Pengguna</CardTitle>
                    <CardDescription>
                      Pengguna yang baru ditambahkan
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockRecentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{user.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          user.role === "Examiner" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {user.role}
                      </Badge>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "destructive"
                        }
                        className="text-xs"
                      >
                        {user.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground w-20 text-right">
                        {user.addedAt}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
              <div className="pt-4 pb-5 px-6">
                <Button
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <Link href="/dashboard/admin/users">
                    Lihat Semua Pengguna
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Aktivitas Terbaru</CardTitle>
                <CardDescription>
                  Peristiwa terbaru di institusi Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockRecentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
              <div className="pt-4 pb-5 px-6">
                <Button
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <Link href="/dashboard/admin/activity">
                    Lihat Semua Log Aktivitas
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Institution Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
          >
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Profil Institusi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    {mockInstitution.logo ? (
                      <Image
                        src={mockInstitution.logo}
                        alt={mockInstitution.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{mockInstitution.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Institusi Pendidikan
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Administrator
                    </p>
                    <p className="text-sm font-medium">
                      {mockInstitution.adminName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm">{mockInstitution.adminEmail}</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/admin/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Kelola Institusi
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Notifikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockSystemNotifications.map((notification) => {
                  const iconMap = {
                    success: CheckCircle,
                    info: FileText,
                    warning: AlertCircle,
                    reminder: Clock,
                  };
                  const Icon =
                    iconMap[notification.type as keyof typeof iconMap];

                  const colorMap = {
                    success: "text-green-500",
                    info: "text-blue-500",
                    warning: "text-yellow-500",
                    reminder: "text-purple-500",
                  };
                  const iconColor =
                    colorMap[notification.type as keyof typeof colorMap];

                  return (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`}
                      />
                      <div className="flex-1">
                        <p className="text-xs leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
