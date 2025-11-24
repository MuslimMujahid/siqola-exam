"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { invitationQueryOptions } from "@/lib/query/invitations";
import { useAcceptInvitation } from "@/hooks/use-accept-invitation";
import { useRejectInvitation } from "@/hooks/use-reject-invitation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const accountSchema = z
  .object({
    fullName: z.string().min(1, "Nama lengkap wajib diisi"),
    phoneNumber: z
      .string()
      .min(10, "Nomor telepon minimal 10 digit")
      .regex(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka"),
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export default function InvitationPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const {
    data: invitation,
    isLoading,
    error,
  } = useQuery(invitationQueryOptions(token));

  const acceptMutation = useAcceptInvitation(token);
  const rejectMutation = useRejectInvitation(token);

  const form = useForm({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      await acceptMutation.mutateAsync({
        fullName: value.fullName,
        phoneNumber: value.phoneNumber,
        password: value.password,
      });
      router.push("/login?invitation=accepted");
    },
    validators: {
      onSubmit: accountSchema,
    },
  });

  const handleAcceptExisting = async () => {
    await acceptMutation.mutateAsync(undefined);
    router.push("/dashboard");
  };

  const handleReject = async () => {
    await rejectMutation.mutateAsync();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">
              Undangan Tidak Valid
            </CardTitle>
            <CardDescription>
              Undangan ini mungkin sudah kadaluarsa atau tidak valid.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full">
              Kembali ke Beranda
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-4">
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl">Undangan Bergabung</CardTitle>
              <CardDescription>
                Anda diundang untuk bergabung dengan{" "}
                <span className="font-semibold">
                  {invitation.institution.name}
                </span>{" "}
                sebagai{" "}
                <span className="font-semibold">
                  {invitation.role === "EXAMINER" ? "Penguji" : "Peserta"}
                </span>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {invitation.isExistingUser ? (
              // Existing user - just needs to accept
              <div className="space-y-4">
                <Alert>
                  <p className="text-sm">
                    Akun Anda sudah terdaftar. Klik tombol terima untuk
                    bergabung dengan institusi ini.
                  </p>
                </Alert>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleAcceptExisting}
                    disabled={
                      acceptMutation.isPending || rejectMutation.isPending
                    }
                    className="w-full"
                  >
                    {acceptMutation.isPending
                      ? "Memproses..."
                      : "Terima Undangan"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    disabled={
                      acceptMutation.isPending || rejectMutation.isPending
                    }
                    className="w-full"
                  >
                    {rejectMutation.isPending
                      ? "Memproses..."
                      : "Tolak Undangan"}
                  </Button>
                </div>
              </div>
            ) : (
              // New user - needs to create account
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-4"
              >
                <Alert variant="warning">
                  <AlertDescription>
                    <p className="text-sm">
                      Lengkapi data berikut untuk membuat akun dan menerima
                      undangan.
                    </p>
                  </AlertDescription>
                </Alert>

                <form.Field name="fullName">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Nama Lengkap</Label>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Masukkan nama lengkap"
                      />
                      {!field.state.meta.isValid && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors?.[0]?.message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={invitation.email} disabled />
                </div>

                <form.Field name="phoneNumber">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Nomor Telepon</Label>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="08xxxxxxxxxx"
                      />
                      {!field.state.meta.isValid && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors?.[0]?.message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="password">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Kata Sandi</Label>
                      <Input
                        id={field.name}
                        type="password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Minimal 8 karakter"
                      />
                      {!field.state.meta.isValid && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors?.[0]?.message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="confirmPassword">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Konfirmasi Kata Sandi</Label>
                      <Input
                        id={field.name}
                        type="password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Ulangi kata sandi"
                      />
                      {!field.state.meta.isValid && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors?.[0]?.message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <div className="flex flex-col gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={
                      acceptMutation.isPending || rejectMutation.isPending
                    }
                    className="w-full"
                  >
                    {acceptMutation.isPending
                      ? "Memproses..."
                      : "Terima & Buat Akun"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReject}
                    disabled={
                      acceptMutation.isPending || rejectMutation.isPending
                    }
                    className="w-full"
                  >
                    {rejectMutation.isPending
                      ? "Memproses..."
                      : "Tolak Undangan"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
