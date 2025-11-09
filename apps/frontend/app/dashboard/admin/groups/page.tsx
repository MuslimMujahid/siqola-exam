"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { faker } from "@faker-js/faker";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCog } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { GroupTable } from "@/components/dashboard/group-table";

// Generate mock groups
const generateMockGroups = () => {
  const groupTypes = [
    { prefix: "Class", suffix: ["A", "B", "C", "D", "E", "F"] },
    { prefix: "Year", suffix: ["1", "2", "3", "4"] },
    {
      prefix: "Department",
      suffix: [
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Engineering",
        "Computer Science",
      ],
    },
    { prefix: "Lab", suffix: ["A", "B", "C"] },
  ];

  const groups: {
    id: number;
    name: string;
    description: string;
    memberCount: number;
    createdAt: string;
  }[] = [];
  let id = 1;

  groupTypes.forEach((type) => {
    type.suffix.forEach((suffix) => {
      const name = `${type.prefix} ${suffix}`;
      const memberCount = faker.number.int({ min: 15, max: 120 });

      let description = "";
      if (type.prefix === "Class") {
        description = `Students enrolled in Class ${suffix}`;
      } else if (type.prefix === "Year") {
        description = `All students in their ${suffix}${suffix === "1" ? "st" : suffix === "2" ? "nd" : suffix === "3" ? "rd" : "th"} year`;
      } else if (type.prefix === "Department") {
        description = `Faculty and students in ${suffix} department`;
      } else if (type.prefix === "Lab") {
        description = `Laboratory group ${suffix} for practical sessions`;
      }

      groups.push({
        id: id++,
        name,
        description,
        memberCount,
        createdAt: faker.date
          .between({ from: "2024-01-01", to: "2024-12-31" })
          .toISOString()
          .split("T")[0],
      });
    });
  });

  return groups;
};

export default function GroupManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Generate mock data
  const mockGroups = useMemo(() => generateMockGroups(), []);

  const filteredGroups = mockGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPaginatedGroups = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredGroups.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = getPaginatedGroups();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Group Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Create and manage groups for organizing users
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/groups/create">
            <UserCog className="w-4 h-4 mr-2" />
            Create Group
          </Link>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-border/50">
          <CardContent className="pt-6 space-y-4">
            {/* Search */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            {paginatedGroups.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No groups found. Create a group to get started.
                </p>
                <Button asChild>
                  <Link href="/dashboard/admin/groups/create">
                    <UserCog className="w-4 h-4 mr-2" />
                    Create Group
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <GroupTable groups={paginatedGroups} />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredGroups.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
