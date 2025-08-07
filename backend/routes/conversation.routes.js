import express from "express";
import { getAllConversations, resetUnread } from "../controllers/conversation.controller.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

// Get all conversations (private and group) for the current user
router.get("/all", isAuth, getAllConversations);
// Reset unread count for a user in a conversation
router.post("/:id/read", isAuth, resetUnread);

export default router;
