"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { User } from "@/lib/api/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserProfileSummaryProps {
  user: User;
  onToggleStatus: () => void;
  isUpdating?: boolean;
}

export function UserProfileSummary({
  user,
  onToggleStatus,
  isUpdating = false,
}: UserProfileSummaryProps) {
  const membership = user.memberships?.[0];
  const status = membership?.status || "PENDING";

  const statusConfig = {
    ACTIVE: {
      icon: CheckCircle2,
      label: "Aktif",
      className: "bg-green-500/10 text-green-700 dark:text-green-400",
    },
    SUSPENDED: {
      icon: XCircle,
      label: "Ditangguhkan",
      className: "bg-red-500/10 text-red-700 dark:text-red-400",
    },
    PENDING: {
      icon: AlertCircle,
      label: "Menunggu",
      className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    },
  };

  const currentStatus = statusConfig[status as keyof typeof statusConfig];
  const StatusIcon = currentStatus.icon;

  const roleLabels = {
    ADMIN: "Admin",
    EXAMINER: "Penguji",
    EXAMINEE: "Peserta",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">Profil Pengguna</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Informasi identitas pengguna
              </p>
            </div>
            <Badge className={currentStatus.className} variant="secondary">
              <StatusIcon className="w-3 h-3 mr-1" />
              {currentStatus.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nama Lengkap</p>
              <p className="font-medium">{user.fullName}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Email</p>
              </div>
              <p className="font-medium">{user.email}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Nomor Telepon</p>
              </div>
              <p className="font-medium">
                {"phoneNumber" in user
                  ? (user as { phoneNumber?: string }).phoneNumber || "-"
                  : "-"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Peran</p>
              </div>
              <p className="font-medium">
                {roleLabels[user.role as keyof typeof roleLabels]}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Bergabung</p>
              </div>
              <p className="font-medium">
                {format(new Date(user.createdAt), "d MMMM yyyy", {
                  locale: idLocale,
                })}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Login Terakhir</p>
              </div>
              <p className="font-medium">
                {user.lastLogin
                  ? format(new Date(user.lastLogin), "d MMMM yyyy, HH:mm", {
                      locale: idLocale,
                    })
                  : "Belum pernah login"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-border/50">
            <div className="flex gap-3">
              {status === "ACTIVE" ? (
                <Button
                  variant="destructive"
                  onClick={onToggleStatus}
                  disabled={isUpdating}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Tangguhkan Pengguna
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={onToggleStatus}
                  disabled={isUpdating}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Aktifkan Pengguna
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
