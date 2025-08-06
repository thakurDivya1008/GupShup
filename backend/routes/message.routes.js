import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js";
import {getMessages, sendMessage, uploadImage} from "../controllers/message.controller.js"

const messageRouter=express.Router();


messageRouter.post("/upload-image", isAuth, upload.single("image"), uploadImage);
messageRouter.post("/send/:reciever", isAuth, upload.single("image"), sendMessage)
messageRouter.get("/get/:reciever", isAuth, getMessages)

export default messageRouter;