"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils/date";
import { useAuthStore } from "@/modules/auth/store/auth";
import { usersQueryOptions } from "@/modules/users/api/users";

export function RecentUsersSection() {
  const user = useAuthStore((state) => state.user);
  const institutionId = user?.memberships?.[0]?.institution?.id;

  // Fetch recent users
  const { data: usersData, isLoading: isLoadingUsers } = useQuery(
    usersQueryOptions({
      institutionId: institutionId,
      limit: 5,
      page: 1,
    })
  );

  return (
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
              <CardDescription>Pengguna yang baru ditambahkan</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoadingUsers ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-40 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : usersData?.data && usersData.data.length > 0 ? (
            usersData.data.map((user) => {
              // Get user's membership status for this institution
              const membership = user.memberships?.find(
                (m) => m.institution.id === institutionId
              );
              const status = membership?.status || "PENDING";
              const timeAgo = formatRelativeTime(user.createdAt);

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{user.fullName}</h4>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      {user.role === "EXAMINER"
                        ? "Penguji"
                        : user.role === "EXAMINEE"
                          ? "Peserta"
                          : "Admin"}
                    </Badge>
                    <Badge
                      variant={status === "ACTIVE" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {status === "ACTIVE"
                        ? "Aktif"
                        : status === "SUSPENDED"
                          ? "Ditangguhkan"
                          : "Menunggu"}
                    </Badge>
                    <span className="text-xs text-muted-foreground w-20 text-right">
                      {timeAgo}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Belum ada pengguna
            </div>
          )}
        </CardContent>
        <div className="pt-4 pb-5 px-6">
          <Button
            variant="ghost"
            className="w-full text-sm text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/dashboard/admin/users">Lihat Semua Pengguna</Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
