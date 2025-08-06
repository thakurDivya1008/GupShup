import express from "express"
import { editProfile, getCurrentUser, getOtherUser, getAllUsers } from "../controllers/user.controller.js";

import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const userRouter=express.Router();


userRouter.get("/current",isAuth,getCurrentUser)
userRouter.put("/profile",isAuth,upload.single("image"),editProfile);
userRouter.get("/other",isAuth, getOtherUser)
userRouter.get("/all", getAllUsers);


export default userRouter