import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js";
import {getMessages, sendMessage} from "../controllers/message.controller.js"

const messageRouter=express.Router();

messageRouter.post("/send/:reciever", isAuth, upload.single("image"), sendMessage)
messageRouter.get("/get/:reciever", isAuth, getMessages)

export default messageRouter;