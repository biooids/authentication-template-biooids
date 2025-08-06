import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { logger } from "../config/logger.js";

interface SocketWithUser extends Socket {
  userId?: string;
}

class SocketManager {
  private io: Server | null = null;

  /**
   * Initializes the Socket.IO server, sets up middleware, and attaches listeners.
   * This should only be called once from server.ts.
   * @param httpServer - The Node.js HTTP server instance.
   */
  public initialize(httpServer: HttpServer): void {
    this.io = new Server(httpServer, {
      cors: {
        origin: config.corsOrigin,
        methods: ["GET", "POST"],
      },
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

  /**
   * Emits a notification event to a specific user's private room.
   * @param userId - The ID of the user to notify.
   * @param notification - The notification data to send.
   */
  public emitNotification(userId: string, notification: any): void {
    if (this.io) {
      this.io.to(userId).emit("new_notification", notification);
      logger.info(
        { userId, notificationId: notification.id },
        "Emitted new notification."
      );
    }
  }

  /**
   * Gracefully closes the Socket.IO server and all connections.
   * @returns A promise that resolves when the server is closed.
   */
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

// Export a single instance to be used throughout the application (singleton pattern)
export const socketManager = new SocketManager();
