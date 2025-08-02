// FILE: src/lib/features/settings/settingsSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { settingsApiSlice } from "./settingsApiSlice";
import { loggedOut } from "../auth/authSlice";
import type { RootState } from "../../store";
import type { UserSettings } from "./settingsTypes";

interface SettingsState {
  userSettings: UserSettings | null;
}

const initialState: SettingsState = {
  userSettings: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    // This allows you to manually set settings if needed elsewhere.
    setCurrentSettings: (state, action: PayloadAction<UserSettings | null>) => {
      state.userSettings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // When a user logs out, clear their settings data.
      .addCase(loggedOut, (state) => {
        state.userSettings = null;
      })
      // When the `getSettings` query is fulfilled, update the state.
      .addMatcher(
        settingsApiSlice.endpoints.getSettings.matchFulfilled,
        (state, action: PayloadAction<UserSettings>) => {
          state.userSettings = action.payload;
        }
      )
      // When the `updateSettings` mutation is fulfilled, also update the state.
      .addMatcher(
        settingsApiSlice.endpoints.updateSettings.matchFulfilled,
        (state, action) => {
          state.userSettings = action.payload.data.settings;
        }
      );
  },
});

export const { setCurrentSettings } = settingsSlice.actions;

// Selector to easily access the settings from any component.
export const selectCurrentSettings = (state: RootState) =>
  state.settings.userSettings;

export default settingsSlice.reducer;
