//src/lib/hooks/useSocket.ts

"use client";

import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

// Create a context to hold the socket instance
export const SocketContext = createContext<Socket | null>(null);

// Create a custom hook to easily access the socket from any component
export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};
