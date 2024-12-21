import Task from "../models/taskModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/customError.js";
import User from "../models/userModel.js";
import isTimeElapsed from "../utils/isTimeElapsed.js";
import { allTasks } from "../utils/taskList.js";

export const fetchTasks = asyncErrorHandler(async (req, res, next) => {
  const tasks = await Task.find({ user: req.user._id });

  const newTasks = allTasks.filter(
    (mainTask) => !tasks.some((userTask) => mainTask.task_id === userTask.task_id)
  );

  for (let task of newTasks) {
    await Task.create({ ...task, status: "not-started", user: req.user.id });
  }

  const fetchedTasks = await Task.find({ user: req.user._id });
  return res.status(200).json(fetchedTasks?.filter((task) => task.status !== "completed"));
});

export const performTask = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;

  // const get_task = await TaskList.findOne({ id });
  const task = await Task.findOne({ task_id: id, user: _id });

  if (task) {
    // const task = new Task(get_task);
    task.click_time = new Date();
    task.status = "in-review";
    await task.save();

    return res.status(200).json("success");
  }

  return res.status(200).json("Tasks unavailable");
});

export const claimTaskReward = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;
  const task = await Task.findOne({ user: _id, task_id: id });

  if (task) {
    const isCompleted = isTimeElapsed(task.click_time, 180);
    if (isCompleted) task.status = "completed";
    await task.save();

    const user = await User.findOne({ _id });
    user.total_reward += task.reward;

    await user.save();
    return res.status(200).json("Task completed");
  }
  return res.status(400).json("Task unavailable");
});
