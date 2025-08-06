import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  isGroup: { type: Boolean, default: false },
  groupName: { type: String },
  groupImage: { type: String },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    }
  ]
}, { timestamps: true });

const Conversation=mongoose.model("Conversation", conversationSchema);
export default Conversation;