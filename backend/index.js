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

import Message from "./models/message.model.js";
import Conversation from "./models/conversation.model.js";

dotenv.config();

const app = express();
 const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
 });

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);


// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   socket.on("join", (userId) => {
//     socket.join(userId);
//     console.log(`User ${userId} joined room ${userId}`);
//   });

//   socket.on("send-message", async (data) => {
//     try {
//       const { senderId, receiverId, message, image } = data;

//       if (!senderId || !receiverId) {
//         return socket.emit("error", "Sender and Receiver IDs are required");
//       }

//       // Save message to DB
//       const newMessage = await Message.create({
//         sender: senderId,
//         receiver: receiverId,
//         message,
//         image,
//       });

//       // Find or create conversation
//       let conversation = await Conversation.findOne({
//         participants: { $all: [senderId, receiverId] },
//       });

//       if (!conversation) {
//         conversation = await Conversation.create({
//           participants: [senderId, receiverId],
//           messages: [newMessage._id],
//         });
//       } else {
//         conversation.messages.push(newMessage._id);
//         await conversation.save();
//       }

//       io.to(senderId).to(receiverId).emit("receive-message", newMessage);

//     } catch (err) {
//       console.error("Error saving message:", err.message);
//       socket.emit("error", "Failed to send message");
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected:", socket.id);
//   });
// });


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
