import mongoose from "mongoose";

const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB Connected");
    }
    catch(error){
        console.error("DB error");
    }
}

export default connectDb