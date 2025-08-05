import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";

export const sendMessage=async (req,res)=>{
    try{
        let sender= req.userId
        let {reciever} = req.params
        let {message} = req.body

        let image;
        if(req.file){
            image=await uploadOnCloudinary(req.file.path)
        }

        let conversation=await Conversation.findOne({
            participants:{$all:[sender,reciever]}
        })

        let newMessage=await Message.create({
            sender, reciever,message,image
        })


        if(!conversation){
            conversation=await Conversation.create({
                participants:[sender, reciever],
                messages: [newMessage._id]
            })
        }else{
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }

        return res.status(201).json(newMessage);
    }

    catch (error){
        return res.status(500).json({message: `send Message error ${error}`});
    }
}


export const getMessages=async (req,res)=>{
    try {
        let sender = req.userId;
        let {reciever} = req.params
        let conversation=await Conversation.findOne({
            participants:{$all:[sender,reciever]}
        }).populate("messages")

        if(!conversation){
            return res.status(400).json
            ({messages: "Conversation not found"})
        }

        return res.status(200).json(conversation?.messages)
        
    } catch (error) {
         return res.status(500).json({message: `get Message error ${error}`});
    }
}