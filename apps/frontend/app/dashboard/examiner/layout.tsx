"use client";

import Link from "next/link";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Notification } from "@/components/dashboard/notification";
import {
  User,
  Settings,
  LogOut,
  Building2,
  ChevronDown,
  Check,
} from "lucide-react";

// Mock data - replace with actual API calls
const mockNotifications = [
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
];

const mockUser = {
  name: "Dr. Jane Smith",
  email: "jane.smith@university.edu",
  institutions: [
    { id: 1, name: "ABC University", role: "Senior Examiner" },
    { id: 2, name: "Tech Institute", role: "Examiner" },
    { id: 3, name: "Online Academy", role: "Guest Examiner" },
  ],
  role: "Examiner",
};

export default function ExaminerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeInstitutionId, setActiveInstitutionId] = useState<number>(
    mockUser.institutions[0].id
  );

  const activeInstitution =
    mockUser.institutions.find((inst) => inst.id === activeInstitutionId) ||
    mockUser.institutions[0];

  const newNotificationsCount = mockNotifications.filter(
    (n) => n.unread
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold tracking-tight text-primary">
                SiqolaExam
              </h1>

              {/* Institution Switcher */}
              {mockUser.institutions.length > 1 && (
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
                    {mockUser.institutions.map((institution) => (
                      <DropdownMenuItem
                        key={institution.id}
                        onClick={() => setActiveInstitutionId(institution.id)}
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
                            <div className="text-xs text-muted-foreground">
                              {institution.role}
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
              )}
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
                    <div className="font-semibold text-sm">{mockUser.name}</div>
                    <div className="text-xs text-muted-foreground font-normal mt-0.5">
                      {mockUser.email}
                    </div>
                    <div className="text-xs text-muted-foreground font-normal">
                      {activeInstitution.name}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/examiner/profile"
                      className="cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/examiner/settings"
                      className="cursor-pointer"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      // Handle logout
                      window.location.href = "/login";
                    }}
                    className="cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">{children}</main>
    </div>
  );
}
