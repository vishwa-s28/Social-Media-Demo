import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { handleSocketEvents } from "../services/socket.service";

let io: Server | null = null;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    handleSocketEvents(io!, socket);
  });

  return io;
};

export const getSocketIO = (): Server => {
  if (!io) throw new Error("Socket.IO is not initialized!");
  return io;
};
