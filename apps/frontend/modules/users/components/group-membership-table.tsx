"use client";

import React from "react";

import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { motion } from "framer-motion";
import { PlusIcon, Trash2Icon, UsersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/modules/auth/store/auth";
import { AddToGroupModal } from "./add-to-group-modal";
import { RemoveFromGroupModal } from "./remove-from-group-modal";

interface GroupMembershipTableProps {
  user: User;
  onRefresh: () => void;
}

export function GroupMembershipTable({
  user,
  onRefresh,
}: GroupMembershipTableProps) {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedGroupId, setSelectedGroupId] = React.useState<string | null>(
    null
  );

  const groups = user.groupMembers || [];

  const handleRemoveClick = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const handleRemoveSuccess = () => {
    setSelectedGroupId(null);
    onRefresh();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Keanggotaan Grup</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Daftar grup yang diikuti pengguna
                </p>
              </div>
              <Button onClick={() => setIsAddModalOpen(true)} size="sm">
                <PlusIcon className="w-4 h-4 mr-2" />
                Tambah ke Grup
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <UsersIcon className="w-12 h-12 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  Pengguna belum tergabung dalam grup manapun
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4"
                  size="sm"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Tambah ke Grup
                </Button>
              </div>
            ) : (
              <div className="rounded-md border border-border/50">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Grup</TableHead>
                      <TableHead>Bergabung Pada</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groups.map((groupMember) => (
                      <TableRow key={groupMember.id}>
                        <TableCell>
                          <div className="font-medium">
                            {groupMember.group.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {"createdAt" in groupMember &&
                            typeof (groupMember as { createdAt?: string })
                              .createdAt === "string"
                              ? format(
                                  new Date(
                                    (
                                      groupMember as { createdAt: string }
                                    ).createdAt
                                  ),
                                  "d MMM yyyy",
                                  {
                                    locale: idLocale,
                                  }
                                )
                              : "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveClick(groupMember.group.id)
                            }
                          >
                            <Trash2Icon className="w-4 h-4 mr-2" />
                            Keluarkan
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <AddToGroupModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        userId={user.id}
        currentGroups={groups.map((gm) => gm.group.id)}
        onSuccess={onRefresh}
      />

      <RemoveFromGroupModal
        isOpen={!!selectedGroupId}
        onClose={() => setSelectedGroupId(null)}
        userId={user.id}
        groupId={selectedGroupId || ""}
        groupName={
          groups.find((gm) => gm.group.id === selectedGroupId)?.group.name || ""
        }
        onSuccess={handleRemoveSuccess}
      />
    </>
  );
}
