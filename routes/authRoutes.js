import express from "express";
import authenticateUser from "../controller/auth.js";
const router = express.Router();

router.post("/auth", authenticateUser);

export default router;
