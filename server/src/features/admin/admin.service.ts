// FILE: server/src/features/admin/admin.service.ts (Corrected)

import prisma from "@/db/prisma.js";
import { User, Prisma, SystemRole } from "@/prisma-client";
import { AdminDashboardStats, AdminApiQuery } from "./admin.types";

class AdminService {
  public async getDashboardStats(): Promise<AdminDashboardStats> {
    const totalUsers = await prisma.user.count();
    return { totalUsers };
  }

  public async getAllUsers(
    query: AdminApiQuery
  ): Promise<{ users: User[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      q,
      sortBy = "joinedAt",
      order = "desc",
      filterByRole,
    } = query;
    const where: Prisma.UserWhereInput = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { username: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    if (filterByRole) {
      where.systemRole = filterByRole;
    }

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  public async updateUserRole(
    userId: string,
    newRole: SystemRole
  ): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { systemRole: newRole },
    });
  }

  public async deleteUser(userId: string): Promise<void> {
    await prisma.user.delete({ where: { id: userId } });
  }
}

export const adminService = new AdminService();
