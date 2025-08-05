import express from "express"
import { login, logout, signUp } from "../controllers/auth.controllers.js";
const authRouter=express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/logout", logout);


export default authRouter