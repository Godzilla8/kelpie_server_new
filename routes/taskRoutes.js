import express from "express";
import { claimTaskReward, fetchTasks, performTask } from "../controller/task.js";
// import { createTasks } from "../utils/taskList.js";
const router = express.Router();

router.get("/", fetchTasks);
router.get("/start/:id", performTask);
router.get("/claim/:id", claimTaskReward);
// router.get("/tasks", createTasks);

export default router;
