import express from "express";
import { claimTaskReward, fetchTasks, performTask } from "../controller/task.js";
const router = express.Router();

router.get("/", fetchTasks);
router.get("/start/:id", performTask);
router.get("/claim/:id", claimTaskReward);

export default router;
