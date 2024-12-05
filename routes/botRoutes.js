import express from "express";
import handleTelegramBot from "../controller/bot.js";
const router = express.Router();

router.post("/webhook", handleTelegramBot);

export default router;
