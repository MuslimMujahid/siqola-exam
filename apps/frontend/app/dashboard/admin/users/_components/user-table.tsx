import Link from "next/link";
import {
  MoreVertical,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: number;
  name: string;
  email: string;
  groups?: string[];
  status: "active" | "suspended" | "pending";
  createdAt: string;
}

interface UserTableProps {
  users: User[];
  showGroups?: boolean;
}

export function UserTable({ users, showGroups = true }: UserTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="default"
            className="bg-green-500/10 text-green-600 hover:bg-green-500/20"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Aktif
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="destructive">
            <Ban className="w-3 h-3 mr-1" />
            Ditangguhkan
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Menunggu
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            {showGroups && <TableHead>Grup</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="w-[70px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              {showGroups && (
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.groups?.map((group) => (
                      <Badge
                        key={group}
                        variant="secondary"
                        className="text-xs"
                      >
                        {group}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              )}
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
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
                        href={`/dashboard/admin/users/${user.id}`}
                        className="cursor-pointer"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Pengguna
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/admin/users/${user.id}/edit`}
                        className="cursor-pointer"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Pengguna
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      {user.status === "suspended" ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Aktifkan
                        </>
                      ) : (
                        <>
                          <Ban className="w-4 h-4 mr-2" />
                          Tangguhkan
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer"
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
  );
}
