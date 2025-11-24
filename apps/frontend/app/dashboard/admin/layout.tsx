"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Settings,
  LogOut,
  Users,
  Building2,
  FileText,
  Activity,
  HelpCircle,
  ChevronDown,
  UserCog,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/use-logout";
import { AuthGuard } from "../_components/auth-guard";
import { Notification } from "../_components/notification";
import { useAuthStore } from "@/store/auth";
import { NavComingSoonWrapper } from "@/components/ui/nav-coming-soon-wrapper";

// Mock data - replace with actual API calls
const mockNotifications = [
  {
    id: 1,
    message: "Pengguna berhasil diundang",
    type: "success",
    time: "5 menit yang lalu",
    unread: true,
  },
  {
    id: 2,
    message: "Dr. Smith membuat ujian baru: Ujian Fisika Akhir",
    type: "info",
    time: "30 menit yang lalu",
    unread: true,
  },
  {
    id: 3,
    message: "Ada 12 pengumpulan yang menunggu penilaian",
    type: "alert",
    time: "1 jam yang lalu",
    unread: true,
  },
  {
    id: 4,
    message: "Ujian Matematika Tengah Semester dimulai dalam 2 jam",
    type: "reminder",
    time: "2 jam yang lalu",
    unread: false,
  },
];

const mockUser = {
  name: "Admin John Doe",
  email: "admin@university.edu",
  role: "Administrator Institusi",
  institution: {
    name: "Universitas ABC",
    logo: null,
  },
};

const navigationItems = [
  { href: "/dashboard/admin/users", label: "Manajemen Pengguna", icon: Users },
  {
    href: "/dashboard/admin/settings",
    label: "Pengaturan Institusi",
    icon: Building2,
    comingSoon: true,
  },
  {
    href: "/dashboard/admin/exams",
    label: "Ujian",
    icon: FileText,
    comingSoon: true,
  },
  {
    href: "/dashboard/admin/activity",
    label: "Log Aktivitas",
    icon: Activity,
    comingSoon: true,
  },
  {
    href: "/dashboard/admin/help",
    label: "Bantuan",
    icon: HelpCircle,
    comingSoon: true,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { logout } = useLogout();

  const newNotificationsCount = mockNotifications.filter(
    (n) => n.unread
  ).length;

  const institutionName =
    user?.memberships?.[0]?.institution?.name || "Institusi";

  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <Link href="/dashboard/admin">
                  <h1 className="text-lg font-semibold tracking-tight text-primary">
                    SiqolaExam
                  </h1>
                </Link>
                <div className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-muted/30">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{institutionName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Notifications dropdown */}
                <Notification
                  newNotificationsCount={newNotificationsCount}
                  notifications={mockNotifications}
                />

                {/* User menu dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium hover:bg-primary/20 transition-colors">
                      {mockUser.name.charAt(0)}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="font-semibold text-sm">
                        {mockUser.name}
                      </div>
                      <div className="text-xs text-muted-foreground font-normal mt-0.5">
                        {mockUser.email}
                      </div>
                      <div className="text-xs text-muted-foreground font-normal">
                        {mockUser.role}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/admin/profile"
                        className="cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        Lihat Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/admin/settings"
                        className="cursor-pointer"
                      >
                        <Settings className="w-4 h-4" />
                        Pengaturan
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={logout}
                      className="cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-1 -mb-px">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href === "/dashboard/admin/users" &&
                    (pathname === "/dashboard/admin/users" ||
                      pathname === "/dashboard/admin/groups"));

                // Special handling for User Management with dropdown
                if (item.href === "/dashboard/admin/users") {
                  return (
                    <DropdownMenu key={item.href}>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                            isActive
                              ? "border-primary text-foreground"
                              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem asChild>
                          <Link
                            href="/dashboard/admin/users"
                            className="cursor-pointer"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Pengguna
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/dashboard/admin/groups"
                            className="cursor-pointer"
                          >
                            <UserCog className="w-4 h-4 mr-2" />
                            Grup
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }

                const navItem = (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      isActive
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );

                return item.comingSoon ? (
                  <NavComingSoonWrapper key={item.href}>
                    {navItem}
                  </NavComingSoonWrapper>
                ) : (
                  navItem
                );
              })}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
