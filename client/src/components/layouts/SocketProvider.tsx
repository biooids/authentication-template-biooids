//src/components/layouts/SocketProvider.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "@/lib/hooks/hooks";
import { notificationReceived } from "@/lib/features/notifications/notificationsSlice";
import { notificationsApiSlice } from "@/lib/features/notifications/notificationsApiSlice";
import { Notification } from "@/lib/features/notifications/notificationsTypes";
import { SocketContext } from "@/lib/hooks/useSocket";
import toast from "react-hot-toast";

// A Broadcast Channel to keep all browser tabs in sync.
const broadcastChannel = new BroadcastChannel("notification_channel");

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let newSocket: Socket;

    if (status === "authenticated" && session.backendAccessToken) {
      const socketUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL!.replace(
        "/api/v1",
        ""
      );

      newSocket = io(socketUrl, {
        auth: { token: session.backendAccessToken },
        // This helps prevent multiple connection attempts on fast refreshes
        transports: ["websocket", "polling"],
      });

      setSocket(newSocket);

      // --- FIX 1: The Server Restart Problem ---
      // This event fires on initial connection AND on every reconnection.
      newSocket.on("connect", () => {
        console.log(
          "WebSocket connected. Checking for missed notifications..."
        );
        // Invalidate the notifications tag to force a "catch-up" fetch.
        dispatch(notificationsApiSlice.util.invalidateTags(["Notifications"]));
      });

      // Listen for new notifications from the server
      newSocket.on("new_notification", (data: Notification) => {
        // Dispatch to the current tab's Redux store
        dispatch(notificationReceived(data));
        // Show a toast notification
        toast.success(data.content, { icon: "🔔" });
        // --- FIX 3: The Multiple Tab Problem ---
        // Broadcast the notification to all other open tabs.
        broadcastChannel.postMessage({
          type: "NEW_NOTIFICATION",
          payload: data,
        });
      });

      newSocket.on("disconnect", () => {
        console.log("WebSocket disconnected.");
      });

      newSocket.on("connect_error", (err) => {
        // This will catch auth errors if the token is expired on initial connect
        console.error("WebSocket connection error:", err.message);
      });
    }

    // This cleanup function runs when the user logs out or the token refreshes.
    return () => {
      if (newSocket) {
        newSocket.disconnect();
        setSocket(null);
      }
    };
    // --- FIX 2: The Expired Token Problem ---
    // By including `session` in the dependency array, this entire useEffect
    // will re-run whenever the user's session is refreshed by NextAuth.
    // The cleanup function will disconnect the old socket, and a new one
    // will be created with the fresh `backendAccessToken`.
  }, [status, session, dispatch]);

  // --- FIX 3: The Multiple Tab Problem (Listener) ---
  useEffect(() => {
    const handleBroadcastMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;
      if (type === "NEW_NOTIFICATION") {
        // When a message comes from another tab, dispatch the action in this tab.
        dispatch(notificationReceived(payload));
      }
    };

    broadcastChannel.addEventListener("message", handleBroadcastMessage);

    // Cleanup the listener when the component unmounts
    return () => {
      broadcastChannel.removeEventListener("message", handleBroadcastMessage);
    };
  }, [dispatch]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
