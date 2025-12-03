"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/modules/auth/store/auth";
import { institutionQueryOptions } from "@/modules/institution/api/institution";

export function InstitutionProfileCard() {
  const user = useAuthStore((state) => state.user);
  const activeInstitution = useAuthStore((state) => state.institution);

  // Get the first active membership's institution ID
  const institutionId = activeInstitution?.id ?? "";

  const { data: institution, isLoading } = useQuery(
    institutionQueryOptions(institutionId)
  );

  return (
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
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="h-3 bg-muted rounded w-1/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-1/4 mt-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  {activeInstitution?.logo ? (
                    <Image
                      src={activeInstitution.logo}
                      alt={activeInstitution.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {institution?.name || "Memuat..."}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                  <p className="text-sm font-medium">
                    {user?.fullName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">{user?.email || "N/A"}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
