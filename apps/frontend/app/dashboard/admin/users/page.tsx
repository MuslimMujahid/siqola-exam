"use client";

import React from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { faker } from "@faker-js/faker";
import { Search, UserPlus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { UserTable } from "./_components/user-table";

// Generate mock data
const generateMockExaminers = () => {
  const statuses = ["active", "suspended", "pending"] as const;

  return Array.from({ length: 45 }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const title = faker.helpers.arrayElement(["Dr.", "Prof."]);

    return {
      id: i + 1,
      name: `${title} ${firstName} ${lastName}`,
      email: faker.internet
        .email({
          firstName: firstName.toLowerCase(),
          lastName: lastName.toLowerCase(),
          provider: "university.edu",
        })
        .toLowerCase(),
      status: faker.helpers.arrayElement(statuses),
      createdAt: faker.date
        .between({ from: "2024-01-01", to: "2024-12-31" })
        .toISOString()
        .split("T")[0],
    };
  });
};

const generateMockExaminees = () => {
  const statuses = ["active", "suspended", "pending"] as const;
  const classes = ["Class A", "Class B", "Class C", "Class D", "Class E"];
  const years = ["Year 1", "Year 2", "Year 3", "Year 4"];

  return Array.from({ length: 120 }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const selectedClass = faker.helpers.arrayElement(classes);
    const selectedYear = faker.helpers.arrayElement(years);

    return {
      id: i + 101,
      name: `${firstName} ${lastName}`,
      email: faker.internet
        .email({
          firstName: firstName.toLowerCase(),
          lastName: lastName.toLowerCase(),
          provider: "university.edu",
        })
        .toLowerCase(),
      groups: [selectedClass, selectedYear],
      status: faker.helpers.arrayElement(statuses),
      createdAt: faker.date
        .between({ from: "2024-01-01", to: "2024-12-31" })
        .toISOString()
        .split("T")[0],
    };
  });
};

const allGroups = [
  "Class A",
  "Class B",
  "Class C",
  "Class D",
  "Class E",
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
];

const generatedExaminers = generateMockExaminers();
const generatedExaminees = generateMockExaminees();

type Examiner = (typeof generatedExaminers)[0];
type Examinee = (typeof generatedExaminees)[0];
type Users = Examiner | Examinee;

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = React.useState("examiners");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [groupFilter, setGroupFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const getFilteredUsers = (users: Users[]) => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesGroup =
        groupFilter === "all" ||
        ("groups" in user && user.groups && user.groups.includes(groupFilter));
      return matchesSearch && matchesStatus && matchesGroup;
    });
  };

  const filteredExaminers = getFilteredUsers(generatedExaminers);
  const filteredExaminees = getFilteredUsers(generatedExaminees);

  const getPaginatedUsers = (users: Users[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users.slice(startIndex, endIndex);
  };

  const getTotalPages = (users: Users[]) => {
    return Math.ceil(users.length / itemsPerPage);
  };

  const currentUsers =
    activeTab === "examiners" ? filteredExaminers : filteredExaminees;
  const paginatedUsers = getPaginatedUsers(currentUsers);
  const totalPages = getTotalPages(currentUsers);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    setSearchQuery("");
    setStatusFilter("all");
    setGroupFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground mt-1">
            View and manage all users in your institution
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/admin/users/add-examiner">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Examiner
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/admin/users/add-examinee">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Examinee
            </Link>
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-4">
                <TabsTrigger value="examiners">
                  Examiners ({filteredExaminers.length})
                </TabsTrigger>
                <TabsTrigger value="examinees">
                  Examinees ({filteredExaminees.length})
                </TabsTrigger>
              </TabsList>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-2">
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                {activeTab === "examinees" && (
                  <Select value={groupFilter} onValueChange={setGroupFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Groups</SelectItem>
                      {allGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <TabsContent value="examiners" className="space-y-4">
                {paginatedUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      No examiners found. Add an examiner to get started.
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/admin/users/add-examiner">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Examiner
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <UserTable users={paginatedUsers} showGroups={false} />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={currentUsers.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                    />
                  </>
                )}
              </TabsContent>

              <TabsContent value="examinees" className="space-y-4">
                {paginatedUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      No examinees found. Add an examinee to get started.
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/admin/users/add-examinee">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Examinee
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <UserTable users={paginatedUsers} showGroups={true} />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={currentUsers.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                    />
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
