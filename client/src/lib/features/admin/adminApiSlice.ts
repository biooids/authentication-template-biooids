// =================================================================
// FILE: src/lib/features/admin/adminApiSlice.ts (Cleaned Version)
// =================================================================
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQueryWithReauth";
import {
  AdminApiQuery,
  GetAdminStatsResponse,
  GetAdminUsersResponse,
  SystemRole,
} from "./adminTypes";

export const adminApiSlice = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  // --- FIX: Removed "AdminPosts" and "AdminComments" tagTypes ---
  tagTypes: ["AdminStats", "AdminUsers"],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<GetAdminStatsResponse, void>({
      query: () => "/admin/stats",
      providesTags: ["AdminStats"],
    }),
    getAdminUsers: builder.query<GetAdminUsersResponse, AdminApiQuery>({
      query: (args) => {
        const params = new URLSearchParams();
        // Convert the query arguments object to URL parameters
        Object.entries(args).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
        return `/admin/users?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.users.map(({ id }) => ({
                type: "AdminUsers" as const,
                id,
              })),
              { type: "AdminUsers", id: "LIST" },
            ]
          : [{ type: "AdminUsers", id: "LIST" }],
    }),
    updateUserRole: builder.mutation<
      void,
      { userId: string; role: SystemRole }
    >({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: "PATCH",
        body: { role },
      }),
      // Refreshes the user list after a role update
      invalidatesTags: [{ type: "AdminUsers", id: "LIST" }],
    }),
    deleteUser: builder.mutation<{ success: boolean; id: string }, string>({
      query: (userId) => ({ url: `/admin/users/${userId}`, method: "DELETE" }),
      // Refreshes the user list and stats after a deletion
      invalidatesTags: ["AdminUsers", "AdminStats"],
    }),
  }),
});

// --- FIX: Removed hooks for deleted endpoints ---
export const {
  useGetDashboardStatsQuery,
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = adminApiSlice;
