//src/websockets/socketManager.ts

import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { logger } from "../config/logger.js";
// 1. IMPORT your advanced corsOptions
import { corsOptions } from "../config/corsOptions.js";

interface SocketWithUser extends Socket {
  userId?: string;
}

class SocketManager {
  private io: Server | null = null;

  public initialize(httpServer: HttpServer): void {
    this.io = new Server(httpServer, {
      // 2. USE the imported corsOptions here
      cors: corsOptions,
    });

    // Middleware for authenticating socket connections
    this.io.use((socket: SocketWithUser, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided."));
      }
      try {
        const decoded = jwt.verify(token, config.jwt.accessSecret) as {
          id: string;
        };
        socket.userId = decoded.id;
        next();
      } catch (err) {
        return next(new Error("Authentication error: Invalid token."));
      }
    });

    this.io.on("connection", (socket: SocketWithUser) => {
      logger.info({ userId: socket.userId }, "A user connected via WebSocket.");
      if (socket.userId) {
        socket.join(socket.userId);
      }
      socket.on("disconnect", () => {
        logger.info({ userId: socket.userId }, "A user disconnected.");
      });
    });

    logger.info("✅ WebSocket server initialized.");
  }

  public emitNotification(userId: string, notification: any): void {
    if (this.io) {
      this.io.to(userId).emit("new_notification", notification);
      logger.info(
        { userId, notificationId: notification.id },
        "Emitted new notification."
      );
    }
  }

  public close(): Promise<void> {
    return new Promise((resolve) => {
      if (this.io) {
        this.io.close(() => {
          logger.info("✅ WebSocket server closed.");
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

export const socketManager = new SocketManager();
