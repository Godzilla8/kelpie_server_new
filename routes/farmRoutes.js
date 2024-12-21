import express from "express";
import { claimDailyReward, claimFarmReward, claimMemoryGameReward } from "../controller/farm.js";
const router = express.Router();

router.get("/claim", claimFarmReward);
router.get("/daily-claim", claimDailyReward);
router.post("/memory-game", claimMemoryGameReward);

export default router;
