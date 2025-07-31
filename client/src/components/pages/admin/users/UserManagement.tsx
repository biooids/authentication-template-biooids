// FILE: src/components/pages/admin/users/UserManagement.tsx (Cleaned Version)
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import toast from "react-hot-toast";

import { useDebounce } from "@/lib/hooks/useDebounce";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import {
  useGetAdminUsersQuery,
  useDeleteUserMutation,
} from "@/lib/features/admin/adminApiSlice";
import { AdminUserRow, SystemRole } from "@/lib/features/admin/adminTypes";

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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Trash2 } from "lucide-react";
import ManagementPageLayout from "../layouts/ManagementPageLayout";
import PaginationControls from "@/components/shared/PaginationControls";

// This sub-component for handling actions per row is already clean.
function UserActions({ user }: { user: AdminUserRow }) {
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const currentUser = useAppSelector(selectCurrentUser);

  const handleDelete = async () => {
    if (currentUser?.id === user.id) {
      toast.error("You cannot delete your own account.");
      return;
    }
    try {
      await deleteUser(user.id).unwrap();
      toast.success(`User @${user.username} has been deleted.`);
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  const isProtectedUser = user.systemRole === SystemRole.SUPER_ADMIN;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="text-red-500 focus:bg-red-500/10"
            onClick={() => setIsAlertOpen(true)}
            disabled={
              isDeleting || currentUser?.id === user.id || isProtectedUser
            }
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the account for{" "}
              <span className="font-bold">@{user.username}</span> and all their
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Yes, delete user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Main Component
export default function UserManagement() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading, isError } = useGetAdminUsersQuery({
    page,
    q: debouncedSearchTerm,
  });

  const users = data?.data.users ?? [];
  const pagination = data?.data.pagination;

  return (
    <ManagementPageLayout
      title="User Management"
      description="View, search, and take action on user accounts."
      itemCount={pagination?.totalItems ?? 0}
      controls={
        <Input
          placeholder="Search by name, username, email..."
          className="w-full max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      }
    >
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              {/* --- FIX: Removed "Content" column --- */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                {/* --- FIX: Updated colSpan from 6 to 5 --- */}
                <TableCell colSpan={5} className="text-center h-24">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-destructive"
                >
                  Failed to load users.
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link
                      href={`/profile/${user.username}`}
                      className="flex items-center gap-3 group"
                    >
                      <Avatar>
                        <AvatarImage src={user.profileImage ?? undefined} />
                        <AvatarFallback>
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium group-hover:underline">
                          {user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          @{user.username}
                        </p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.systemRole === "SUPER_ADMIN"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {user.systemRole}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(user.joinedAt), "PP")}</TableCell>
                  {/* --- FIX: Removed "Content" cell --- */}
                  <TableCell className="text-right">
                    <UserActions user={user} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <PaginationControls pagination={pagination} onPageChange={setPage} />
      )}
    </ManagementPageLayout>
  );
}
