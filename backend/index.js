// import connectDb from "./config/db.js";
// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import authRouter from "./routes/auth.routes.js";
// dotenv.config();
// import cors from "cors"
// import userRouter from "./routes/user.routes.js";
// import messageRouter from "./routes/message.routes.js";

// const port=process.env.PORT || 5000;

// const app=express();
// app.use(cors({
//   origin:"http://localhost:5173",
//   credentials:true
// }))
// app.use(express.json()); 
// app.use(cookieParser());

// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);
// app.use("/api/message", messageRouter);

// const startServer = async () => {
//   try {
//     await connectDb();
//     app.listen(port, () => {
//       console.log(`Server started on port ${port}`);
//     });
//   } catch (error) {
//     console.error("Failed to connect to DB", error);
//   }

// }

// startServer(); 

// import connectDb from "./config/db.js";
// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import http from "http";               // ✅ Needed for custom server
// import { Server } from "socket.io";    // ✅ Import socket.io

// import authRouter from "./routes/auth.routes.js";
// import userRouter from "./routes/user.routes.js";
// import messageRouter from "./routes/message.routes.js";

// dotenv.config();

// const port = process.env.PORT || 5000;

// const app = express();
// const server = http.createServer(app); // ✅ Create HTTP server from Express

// // ✅ Setup Socket.IO on that server
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // Frontend URL
//     credentials: true,
//   },
// });

// // ✅ Socket.IO connection logic
// io.on("connection", (socket) => {
//   console.log("🔌 User connected:", socket.id);

//   // Handle message send
//   socket.on("send-message", (data) => {
//     console.log("📨 Message received from client:", data);

//     // Optional: Save message to MongoDB here

//     // Broadcast message to all connected clients (or use rooms)
//     io.emit("receive-message", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//   });
// });

// // ✅ Middleware
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));
// app.use(express.json());
// app.use(cookieParser());

// // ✅ API Routes
// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);
// app.use("/api/message", messageRouter);

// // ✅ Start Server
// const startServer = async () => {
//   try {
//     await connectDb();
//     server.listen(port, () => {
//       console.log(`🚀 Server started on port ${port}`);
//     });
//   } catch (error) {
//     console.error("❌ Failed to connect to DB", error);
//   }
// };

// startServer();



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

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  socket.on("send-message", async (data) => {
    const { senderId, receiverId, message, image } = data;

    try {
      const newMessage = new Message({ sender: senderId, receiver: receiverId, message, image });
      const savedMessage = await newMessage.save();

      let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });

      if (!conversation) {
        conversation = new Conversation({
          participants: [senderId, receiverId],
          messages: [savedMessage._id]
        });
      } else {
        conversation.messages.push(savedMessage._id);
      }

      await conversation.save();

      io.emit("receive-message", savedMessage);
    } catch (err) {
      console.error(" Error saving message:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log(" Socket disconnected:", socket.id);
  });
});

const port = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDb();
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ DB connection failed", err);
  }
};

startServer();
