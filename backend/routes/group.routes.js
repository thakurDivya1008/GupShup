import express from "express";
import { createGroup, leaveGroup } from "../controllers/group.controller.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

// Create a new group
router.post("/create-group", isAuth, createGroup);
router.post("/:id/leave", isAuth, leaveGroup);

export default router;
