import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import connectDb from "./config/db.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

import messageRouter from "./routes/message.routes.js";
import groupRouter from "./routes/group.routes.js";
import conversationRouter from "./routes/conversation.routes.js";

import Message from "./models/message.model.js";
import Conversation from "./models/conversation.model.js";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json" assert { type: "json" };

dotenv.config();

const app = express();
 const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5174", "http://127.0.0.1:5174"],
    credentials: true
  }
 });

app.use(cors({
  origin: ["http://localhost:5174", "http://127.0.0.1:5174"],
  credentials: true
}));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Serve static files for uploaded images
app.use('/public', express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use("/api/message", messageRouter);
app.use("/api/group", groupRouter);
app.use("/api/conversation", conversationRouter);


io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on("send-message", async (data) => {
    try {
      const { senderId, receiverId, message, image, conversationId, isGroup } = data;

      if (!senderId) {
        return socket.emit("error", "Sender is required");
      }

      let conversation;
      let newMessage;

      if (isGroup) {
        if (!conversationId) {
          return socket.emit("error", "Conversation ID is required for group messages");
        }
        conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.isGroup) {
          return socket.emit("error", "Invalid group conversation");
        }
        newMessage = await Message.create({
          sender: senderId,
          conversation: conversationId,
          message,
          image,
          seen: [] // Ensure seen is empty on creation
        });
        conversation.messages.push(newMessage._id);
      } else {
        if (!receiverId) {
          return socket.emit("error", "Receiver is required for direct messages");
        }
        newMessage = await Message.create({
          sender: senderId,
          receiver: receiverId,
          message,
          image,
          seen: [] // Ensure seen is empty on creation
        });
        conversation = await Conversation.findOne({
          participants: { $all: [senderId, receiverId] },
        });
        if (!conversation) {
          conversation = await Conversation.create({
            participants: [senderId, receiverId],
            messages: [newMessage._id],
          });
        } else {
          conversation.messages.push(newMessage._id);
        }
      }

      
      const targetList = conversation.isGroup ? conversation.members : conversation.participants;
      targetList.forEach(userId => {
        if (userId.toString() !== senderId) {
          conversation.unreadCounts.set(
            userId.toString(),
            (conversation.unreadCounts.get(userId.toString()) || 0) + 1
          );
        }
      });
      await conversation.save();

      if (conversation.isGroup) {
        const rooms = conversation.members.map(id => id.toString());
        // Emit to each member's room so sender also receives their own message
        rooms.forEach(roomId => {
          io.to(roomId).emit("receive-message", { ...newMessage.toObject(), conversationId: conversation._id, isGroup: true, seen: (newMessage.seen || []).map(id => id.toString()) });
        });
      } else {
        io.to(senderId).to(receiverId).emit("receive-message", {
          ...newMessage.toObject(),
          conversationId: conversation._id,
          isGroup: false,
          seen: (newMessage.seen || []).map(id => id.toString())
        });
      }

    } catch (err) {
      console.error("Error saving message:", err.message);
      socket.emit("error", "Failed to send message");
    }
  });

  socket.on("message:seen", async ({ messageIds, userId }) => {
    try {
      if (!Array.isArray(messageIds) || !userId) return;
      // Update all messages to add userId to seen array if not already present
      await Promise.all(messageIds.map(async (msgId) => {
        const msg = await Message.findById(msgId);
        if (msg && !msg.seen.includes(userId)) {
          msg.seen.push(userId);
          await msg.save();
          // Notify sender (if not the same as the viewer)
          if (msg.sender.toString() !== userId) {
            io.to(msg.sender.toString()).emit("message:seen:update", { messageId: msgId, seenBy: userId });
          }
        }
      }));
    } catch (err) {
      console.error("Error updating seen status:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});


const port = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDb();
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error(" DB connection failed", err);
  }
};

startServer();
