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

// Leave group: remove current user from members
export const leaveGroup = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params; // group conversation id

    const group = await Conversation.findById(id);
    if (!group || !group.isGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Remove user from members
    const before = group.members.length;
    group.members = group.members.filter(m => m.toString() !== userId.toString());

    if (group.members.length === before) {
      return res.status(400).json({ message: "You are not a member of this group" });
    }

    // Clear unread for that user (optional) and save
    group.unreadCounts.delete(userId.toString());
    await group.save();

    return res.json({ success: true, message: "Left group successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to leave group", error: err.message });
  }
};