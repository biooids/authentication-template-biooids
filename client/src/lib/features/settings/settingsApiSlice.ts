// FILE: src/lib/features/settings/settingsApiSlice.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQueryWithReauth";
import type {
  UserSettings,
  UpdateUserSettingsDto,
  GetSettingsApiResponse,
  UpdateSettingsApiResponse,
} from "./settingsTypes";

export const settingsApiSlice = createApi({
  reducerPath: "settingsApi",
  baseQuery: baseQueryWithReauth,
  // Tag types are used for caching and automatic re-fetching.
  tagTypes: ["Settings"],
  endpoints: (builder) => ({
    /**
     * Fetches the current user's settings from the backend.
     */
    getSettings: builder.query<UserSettings, void>({
      query: () => "/settings",
      // Transform the response to extract the nested settings object.
      transformResponse: (response: GetSettingsApiResponse) =>
        response.data.settings,
      // Provides a 'Settings' tag to the cached data.
      providesTags: ["Settings"],
    }),
    /**
     * Updates the current user's settings.
     */
    updateSettings: builder.mutation<
      UpdateSettingsApiResponse,
      UpdateUserSettingsDto
    >({
      query: (updateData) => ({
        url: "/settings",
        method: "PATCH",
        body: updateData,
      }),
      // Invalidates the 'Settings' tag upon success, forcing a re-fetch.
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } =
  settingsApiSlice;
