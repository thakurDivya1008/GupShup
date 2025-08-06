import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

// Image upload endpoint for chat
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // If using cloudinary:
     const result = await uploadOnCloudinary(req.file.path);
    return res.json({ imageUrl: result.secure_url });

    // If storing locally, return absolute URL
    // const imageUrl = `${req.protocol}://${req.get('host')}/public/${req.file.filename}`;
    // return res.json({ imageUrl });

    // // If storing locally:
    // return res.json({ imageUrl: `/public/${req.file.filename}` });
  } catch (error) {
    return res.status(500).json({ message: 'Image upload failed', error });
  }
};


export const sendMessage = async (req, res) => {
    try {
        let sender = req.userId;
        let { reciever } = req.params;
        let { message } = req.body;

        // Debug logging
        console.log('sender:', sender);
        console.log('reciever:', reciever);
        console.log('message:', message);
        console.log('file:', req.file);

        // Validation
        if (!sender || !reciever || (!message && !req.file)) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [sender, reciever] }
        });

        let newMessage = await Message.create({
            sender,
            receiver: reciever, // fix typo to match schema
            message,
            image
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [sender, reciever],
                messages: [newMessage._id]
            });
        } else {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }

        return res.status(201).json(newMessage);
    } catch (error) {
        console.error('sendMessage error:', error);
        return res.status(500).json({ message: `send Message error ${error}` });
    }
};


export const getMessages=async (req,res)=>{
    try {
        let sender = req.userId;
        let {reciever} = req.params
        let conversation=await Conversation.findOne({
            participants:{$all:[sender,reciever]}
        }).populate("messages")

        if(!conversation){
            // Return empty array if conversation not found
            return res.status(200).json([]);
        }

        return res.status(200).json(conversation?.messages)
        
    } catch (error) {
         return res.status(500).json({message: `get Message error ${error}`});
    }
}