import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

// Get all conversations (private and group) for the current user
export const getAllConversations = async (req, res) => {
  try {
    const userId = req.userId;
    // Find all conversations where user is a participant or member
    const conversations = await Conversation.find({
      $or: [
        { participants: userId },
        { members: userId }
      ]
    })
      .populate({
        path: "participants members",
        select: "_id name userName image email"
      })
      .populate({
        path: "messages",
        select: "_id message image createdAt sender receiver"
      })
      .sort({ updatedAt: -1 });
    // Add unread count for the current user
    const result = conversations.map(conv => {
      const unread = conv.unreadCounts?.get(userId.toString()) || 0;
      return { ...conv.toObject(), unread };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch conversations", error: err.message });
  }
};

// Reset unread count for a user in a conversation
export const resetUnread = async (req, res) => {
  try {
    const userId = req.userId;
    const conversationId = req.params.id;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
    conversation.unreadCounts.set(userId.toString(), 0);
    await conversation.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset unread', error: err.message });
  }
};
