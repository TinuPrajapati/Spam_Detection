import express from "express";
import { classifyMessage } from "../controllers/classifyController.js";

const router = express.Router();

router.post("/", classifyMessage);

export default router;
