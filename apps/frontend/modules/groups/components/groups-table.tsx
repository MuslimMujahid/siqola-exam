import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteGroup } from "../api/groups";

interface Group {
  id: string | number;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
}

interface GroupTableProps {
  groups: Group[];
}

export function GroupTable({ groups }: GroupTableProps) {
  const { confirm, ConfirmDialog } = useConfirm();

  const { mutate: deleteGroup, isPending: isDeletingGroup } = useDeleteGroup();

  const handleDeleteGroup = async (
    groupId: string | number,
    groupName: string
  ) => {
    const confirmed = await confirm({
      title: "Hapus Grup",
      description: `Menghapus grup tidak akan menghapus data anggota atau ujian. Apakah Anda yakin ingin menghapus grup "${groupName}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Hapus",
      cancelText: "Batal",
      variant: "destructive",
    });

    if (confirmed) {
      deleteGroup(String(groupId));
    }
  };

  return (
    <>
      <ConfirmDialog />
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-center">Anggota</TableHead>
              <TableHead className="w-[70px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium">{group.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {group.description}
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {group.memberCount}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/groups/${group.id}`}
                          className="cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Grup
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/groups/${group.id}/edit`}
                          className="cursor-pointer"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Grup
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => handleDeleteGroup(group.id, group.name)}
                        disabled={isDeletingGroup}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
