"use client";

import React from "react";

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
  Check,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/modules/auth/api/login";
import { useAuthStore } from "@/modules/auth/store/auth";
import { NavComingSoonWrapper } from "@/components/ui/nav-coming-soon-wrapper";

// Mock notifications - replace with actual API calls
const mockNotifications = {
  ADMIN: [
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
  ],
  EXAMINER: [
    {
      id: 1,
      message: "5 new submissions for Mathematics Final Exam",
      type: "submission",
      time: "10 minutes ago",
      unread: true,
    },
    {
      id: 2,
      message: "Physics Midterm will go live in 2 hours",
      type: "alert",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      message: "Chemistry Quiz has ended",
      type: "reminder",
      time: "3 hours ago",
      unread: false,
    },
  ],
  EXAMINEE: [
    {
      id: 1,
      message: "Your Biology Test has been graded",
      type: "grade",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      message: "You are added to Physics Midterm",
      type: "new_exam",
      time: "1 day ago",
      unread: true,
    },
    {
      id: 3,
      message: "Mathematics Final Exam starts in 7 days",
      type: "reminder",
      time: "3 days ago",
      unread: false,
    },
  ],
};

// Navigation items for each role
const adminNavigation = [
  { href: "/dashboard/users", label: "Manajemen Pengguna", icon: Users },
  {
    href: "/dashboard/settings",
    label: "Pengaturan Institusi",
    icon: Building2,
    comingSoon: true,
  },
  {
    href: "/dashboard/exams",
    label: "Ujian",
    icon: FileText,
    comingSoon: true,
  },
  {
    href: "/dashboard/activity",
    label: "Log Aktivitas",
    icon: Activity,
    comingSoon: true,
  },
  {
    href: "/dashboard/help",
    label: "Bantuan",
    icon: HelpCircle,
    comingSoon: true,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { logout } = useLogout();
  const [activeInstitutionId, setActiveInstitutionId] = React.useState<
    string | null
  >(user?.memberships?.[0]?.institution?.id || null);

  // Determine user role
  const userRole = user?.role as "ADMIN" | "EXAMINER" | "EXAMINEE" | undefined;

  // Get notifications based on role
  const notifications = userRole ? mockNotifications[userRole] : [];
  const newNotificationsCount = notifications.filter((n) => n.unread).length;

  // Get active institution
  const activeInstitution =
    user?.memberships?.find((m) => m.institution.id === activeInstitutionId)
      ?.institution || user?.memberships?.[0]?.institution;

  // Get institutions for examiner/admin (multi-institution support)
  const institutions = user?.memberships?.map((m) => m.institution) || [];
  const hasMultipleInstitutions = institutions.length > 1;

  const showNavigation = userRole === "ADMIN";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <h1 className="text-lg font-semibold tracking-tight text-primary">
                  ZiqolaExam
                </h1>
              </Link>

              {/* Institution Display/Switcher */}
              {activeInstitution && (
                <>
                  {hasMultipleInstitutions &&
                  (userRole === "EXAMINER" || userRole === "ADMIN") ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-border/50 hover:bg-muted/50 transition-colors">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {activeInstitution.name}
                          </span>
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-64">
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                          Switch Institution
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {institutions.map((institution) => (
                          <DropdownMenuItem
                            key={institution.id}
                            onClick={() =>
                              setActiveInstitutionId(institution.id)
                            }
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-3 w-full">
                              <Building2
                                className={`w-4 h-4 ${
                                  institution.id === activeInstitutionId
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium">
                                  {institution.name}
                                </div>
                              </div>
                              {institution.id === activeInstitutionId && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-muted/30">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {activeInstitution.name}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative w-9 h-9 rounded-md flex items-center justify-center hover:bg-muted/50 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                    {newNotificationsCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="cursor-pointer p-3"
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm">{notification.message}</p>
                            {notification.unread && (
                              <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-muted-foreground text-center">
                      No notifications
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium hover:bg-primary/20 transition-colors">
                    {user?.fullName?.charAt(0) || "U"}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-semibold text-sm">
                      {user?.fullName}
                    </div>
                    <div className="text-xs text-muted-foreground font-normal mt-0.5">
                      {user?.email}
                    </div>
                    {userRole && (
                      <div className="text-xs text-muted-foreground font-normal">
                        {userRole === "ADMIN" && "Administrator"}
                        {userRole === "EXAMINER" && "Examiner"}
                        {userRole === "EXAMINEE" && "Examinee"}
                      </div>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <User className="w-4 h-4" />
                      {userRole === "ADMIN" ? "Lihat Profil" : "View Profile"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="w-4 h-4" />
                      {userRole === "ADMIN" ? "Pengaturan" : "Settings"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={logout}
                    className="cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    {userRole === "ADMIN" ? "Keluar" : "Log out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Navigation (Admin only) */}
          {showNavigation && (
            <nav className="flex items-center gap-1 -mb-px">
              {adminNavigation.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href === "/dashboard/users" &&
                    (pathname === "/dashboard/users" ||
                      pathname === "/dashboard/groups"));

                // Special handling for User Management with dropdown
                if (item.href === "/dashboard/users") {
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
                            href="/dashboard/users"
                            className="cursor-pointer"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Pengguna
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/dashboard/groups"
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
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">{children}</main>
    </div>
  );
}
