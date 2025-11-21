"use client";

import React from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { SlidersHorizontal, Info } from "lucide-react";

import { type UserRoleType } from "@/lib/schemas/auth";
import { RoleSelectionTabs } from "@/components/ui/role-selection-tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InstitutionRegisterForm } from "./_components/institution-register-form";

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = React.useState<UserRoleType>("admin");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Column - Hero Content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden lg:flex flex-col justify-center px-12 xl:px-20 bg-muted/30"
      >
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-primary">
              SiqolaExam
            </h2>
            <p className="text-lg text-muted-foreground">
              Bergabung bersama kami dan mulai kelola ujian Anda dengan mudah
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 mt-1">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Pengaturan Mudah</h3>
                <p className="text-sm text-muted-foreground">
                  Mulai dalam hitungan menit dengan platform intuitif kami.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Column - Registration Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="w-full max-w-md"
        >
          <Card className="w-full border-border/50 shadow-sm">
            <CardHeader className="space-y-4 p-6">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  Buat Akun Baru
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Pilih peran Anda dan isi detail pendaftaran
                </CardDescription>
              </div>

              <RoleSelectionTabs
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
              />
            </CardHeader>

            {selectedRole === "admin" ? (
              <InstitutionRegisterForm />
            ) : (
              <CardContent className="space-y-4 p-6 pt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-muted/50 border border-border/50 p-6 space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 mt-0.5">
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">
                        {selectedRole === "examiner"
                          ? "Permintaan Akun Penguji"
                          : "Permintaan Akun Peserta"}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedRole === "examiner"
                          ? "Akun Penguji dibuat oleh institusi. Silakan hubungi administrator institusi Anda untuk mendapatkan akses."
                          : "Akun Peserta dibuat oleh institusi. Silakan hubungi administrator institusi Anda untuk mendapatkan akses."}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div className="text-center text-sm text-muted-foreground pt-2">
                  Sudah punya akun?{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Masuk di sini
                  </Link>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
