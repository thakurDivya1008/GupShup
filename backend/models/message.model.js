import mongoose from "mongoose"
const messageSchema= new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    // For direct messages, receiver is a User
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:false
    },
    // For group messages, reference the Conversation instead
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: false
    },

    message:{
        type:String,
       default:"",
    },
    image:{
        type:String,
       default:""
    }


}, {timestamps:true})

const Message=mongoose.model("Message", messageSchema);

export default Message;