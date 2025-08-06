import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

// Create a new group conversation
export const createGroup = async (req, res) => {
  try {
    const { groupName, groupImage, members } = req.body;
    if (!groupName || !Array.isArray(members) || members.length < 2) {
      return res.status(400).json({ message: "Group name and at least 2 members are required." });
    }
    const group = await Conversation.create({
      isGroup: true,
      groupName,
      groupImage,
      members,
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: "Failed to create group", error: err.message });
  }
};

// Optionally, add more group-related controllers here (add/remove member, update group, etc.)
