import { Server, Socket } from "socket.io";
import db from "../models";
import jwt from "jsonwebtoken";
import "dotenv/config";

interface MessageData {
  sender_id: string;
  receiver_id?: string;
  group_id?: string;
  message: string;
}

interface GroupData {
  id: string;
  creator_id: string;
  name: string;
  members: string[];
}

export const handleSocketEvents = (io: Server, socket: Socket) => {
  console.log(`🔗 New client connected: ${socket.id}`);

  // Extract token from headers
  const token = socket.handshake.headers.authorization;
  if (!token) {
    console.error("❌ Authorization token is missing");
    socket.emit("error", { message: "Authorization token is missing" });
    return;
  }

  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not set");
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token.startsWith("Bearer ") ? token.slice(7) : token,
      process.env.JWT_SECRET_KEY
    );

    if (decoded && typeof decoded === "object" && "id" in decoded) {
      const userId = decoded.id;

      // Join the user-specific room
      socket.join(userId);
      console.log(`✅ User ${userId} joined room ${socket.id}`);
      socket.emit("roomJoined", { room: userId });

      // 📌 Handle Creating a Group
      socket.on("createGroup", async (groupData: GroupData) => {
        const { creator_id, name, members } = groupData;

        if (!creator_id || !name || !members.length) {
          socket.emit("error", { message: "Invalid group data" });
          return;
        }

        if (creator_id !== userId) {
          socket.emit("error", { message: "Unauthorized: Invalid sender ID" });
          return;
        }

        try {
          // Save group in DB
          const newGroup = await db.GroupChat.create({
            creator_id,
            group_name: name,
            members,
          });

          // Join the group room
          const group_id = newGroup.get("id") as string;
          socket.join(group_id);

          members.forEach((memberId) => {
            io.to(memberId).emit("groupCreated", {
              group_id,
              name,
              creator_id,
              members,
            });
          });

          console.log(`📢 Group ${name} created with ID ${group_id}`);
        } catch (error) {
          console.error("Error while creating group:", error);
          socket.emit("error", { message: "Failed to create group" });
        }
      });

      // 📌 Handle Joining a Group
      socket.on("joinGroup", async (group_id: string) => {
        try {
          const group = await db.GroupChat.findByPk(group_id);

          if (!group) {
            socket.emit("error", { message: "Group not found" });
            return;
          }

          const members = group.get("members") as string[];

          if (!members.includes(userId)) {
            socket.emit("error", {
              message: "You are not a member of this group",
            });
            return;
          }

          socket.join(group_id);
          console.log(`✅ User ${userId} joined group ${group_id}`);

          socket.emit("groupJoined", { group_id, name: group.get("name") });
        } catch (error) {
          console.error("Error while joining group:", error);
          socket.emit("error", { message: "Failed to join group" });
        }
      });

      // 📌 Handle Sending Messages
      socket.on("sendMessage", async (data: MessageData) => {
        const { sender_id, receiver_id, group_id, message } = data;

        // Validate sender ID
        if (sender_id !== userId) {
          socket.emit("error", { message: "Unauthorized: Invalid sender ID" });
          return;
        }

        if (!message || (!receiver_id && !group_id)) {
          socket.emit("error", { message: "Invalid data: Missing fields" });
          return;
        }

        try {
          let newMessage;
          if (group_id) {
            // Group Message
            newMessage = await db.GroupMessage.create({
              sender_id,
              group_id,
              message,
              status: "sent",
            });

            io.to(group_id).emit("receiveGroupMessage", {
              id: newMessage.get("id"),
              sender_id,
              group_id,
              message,
              status: "sent",
              createdAt: newMessage.get("createdAt"),
            });

            console.log(`📨 Group message sent in ${group_id}`);
          } else if (receiver_id) {
            // Private Message
            newMessage = await db.Chat.create({
              sender_id,
              receiver_id,
              message,
              status: "sent",
            });

            io.to(receiver_id).emit("receiveMessage", {
              id: newMessage.get("id"),
              sender_id,
              receiver_id,
              message,
              status: "sent",
              createdAt: newMessage.get("createdAt"),
            });

            console.log(`📨 Private message sent to ${receiver_id}`);
          }
          // Acknowledge the sender
          socket.emit("messageSent", {
            id: newMessage?.get("id"),
            message: "Message sent successfully!",
          });

          // Mark message as delivered
          await newMessage?.update({ status: "delivered" });

          if (group_id) {
            io.to(group_id).emit("statusUpdate", {
              messageId: newMessage?.get("id"),
              status: "delivered",
            });
          } else if (receiver_id) {
            io.to(receiver_id).emit("statusUpdate", {
              messageId: newMessage?.get("id"),
              status: "delivered",
            });
          }
        } catch (error) {
          console.error("Error while sending message:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      });

      // 📌 Handle User Disconnection
      socket.on("disconnect", () => {
        console.log(`❌ User ${userId} disconnected`);
        socket.leave(userId);
      });
    } else {
      console.error("Invalid token payload");
      socket.emit("error", { message: "Invalid token payload" });
    }
  } catch (error) {
    console.error("JWT verification failed:", error);
    socket.emit("error", { message: "Invalid or expired token" });
    socket.disconnect();
  }
};
