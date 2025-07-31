// FILE: src/lib/features/admin/adminTypes.ts (Cleaned Version)

// --- FIX: Kept only the SystemRole enum which is used ---
export enum SystemRole {
  USER = "USER",
  SYSTEM_CONTENT_CREATOR = "SYSTEM_CONTENT_CREATOR",
  DEVELOPER = "DEVELOPER",
  SUPER_ADMIN = "SUPER_ADMIN",
}

// --- Data Shapes ---

// --- FIX: Simplified to match backend response (only totalUsers) ---
export interface AdminDashboardStats {
  totalUsers: number;
}

// --- FIX: Simplified _count to be an empty object as posts/comments don't exist ---
export interface AdminUserRow {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImage: string | null;
  systemRole: SystemRole;
  joinedAt: string; // ISO date string
  _count: {}; // The backend sends an empty _count object
}

// --- API Query Arguments ---

// --- FIX: Removed post-specific filters like filterByCategory ---
export interface AdminApiQuery {
  page?: number;
  limit?: number;
  q?: string;
  sortBy?: "name" | "username" | "email" | "joinedAt";
  order?: "asc" | "desc";
  filterByRole?: SystemRole;
}

// --- Full API Response Shapes ---

export interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface GetAdminStatsResponse {
  status: string;
  data: AdminDashboardStats;
}

export interface GetAdminUsersResponse {
  status: string;
  data: {
    users: AdminUserRow[];
    pagination: PaginationInfo;
  };
}
