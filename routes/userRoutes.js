import express from "express";
const router = express.Router();
import { fetchLeaderBoard, fetchReferrals, fetchUser } from "../controller/user.js";

router.get("/user", fetchUser);
router.get("/referrals", fetchReferrals);
router.get("/leaderboard", fetchLeaderBoard);

export default router;
