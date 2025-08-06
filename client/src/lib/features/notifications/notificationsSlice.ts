//src/lib/features/notifications/notificationsSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { notificationsApiSlice } from "./notificationsApiSlice";
import { loggedOut } from "../auth/authSlice";
import type { RootState } from "../../store";
import type { Notification } from "./notificationsTypes";

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // This action is called by our WebSocket when a new notification arrives.
    notificationReceived: (state, action: PayloadAction<Notification>) => {
      // Add the new notification to the top of the list
      state.notifications.unshift(action.payload);
      // Increment the unread count
      state.unreadCount++;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loggedOut, (state) => {
        // Clear all notifications when the user logs out
        state.notifications = [];
        state.unreadCount = 0;
      })
      // When the initial list of notifications is fetched, populate the state.
      .addMatcher(
        notificationsApiSlice.endpoints.getNotifications.matchFulfilled,
        (state, action: PayloadAction<Notification[]>) => {
          state.notifications = action.payload;
          // Calculate the initial unread count
          state.unreadCount = action.payload.filter((n) => !n.isRead).length;
        }
      )
      // When notifications are marked as read, update the local state immediately.
      .addMatcher(
        notificationsApiSlice.endpoints.markAllAsRead.matchFulfilled,
        (state) => {
          state.notifications.forEach((n) => {
            n.isRead = true;
          });
          state.unreadCount = 0;
        }
      );
  },
});

export const { notificationReceived } = notificationsSlice.actions;

export const selectAllNotifications = (state: RootState) =>
  state.notifications.notifications;
export const selectUnreadNotificationsCount = (state: RootState) =>
  state.notifications.unreadCount;

export default notificationsSlice.reducer;
