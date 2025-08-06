//src/lib/features/notifications/notificationsApiSlice.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQueryWithReauth";
import type {
  Notification,
  GetNotificationsApiResponse,
} from "./notificationsTypes";

export const notificationsApiSlice = createApi({
  reducerPath: "notificationsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => "/notifications",
      transformResponse: (response: GetNotificationsApiResponse) =>
        response.data.notifications,
      providesTags: ["Notifications"],
    }),
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/read",
        method: "POST",
      }),
      // When this succeeds, it will refetch the notifications list.
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkAllAsReadMutation } =
  notificationsApiSlice;
