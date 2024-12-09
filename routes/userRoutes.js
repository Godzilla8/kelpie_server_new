import express from "express";
const router = express.Router();
import { fetchReferrals, fetchUser } from "../controller/user.js";

router.get("/user", fetchUser);
router.get("/referrals", fetchReferrals);

export default router;
