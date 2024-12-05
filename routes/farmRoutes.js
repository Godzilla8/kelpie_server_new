import express from "express";
import { claimFarmReward } from "../controller/farm.js";
const router = express.Router();

router.get("/claim", claimFarmReward);

export default router;
