import express from "express";
import { createGroup } from "../controllers/group.controller.js";

const router = express.Router();

// Create a new group
router.post("/create-group", createGroup);

export default router;
