import validateTelegramData from "../utils/validateTelegramData.js";
import User from "../models/userModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import Task from "../models/taskModel.js";
import { allTasks } from "../utils/taskList.js";
import { createJwtToken, cookieOptions } from "../utils/createJwtToken.js";

const authenticateUser = asyncErrorHandler(async (req, res, next) => {
  const { initData } = req.body;

  const validatedUser = validateTelegramData(initData);
  console.log(validatedUser);
  if (validatedUser) return res.status(401).json("Error validating user");

  const user = await User.findOne({ chat_id: validatedUser.id });

  if (!user) {
    // Work on this below. Check out validateUser details to make sure they are in order
    const newUser = await User.create(validatedUser);
    const { _id, chat_id } = newUser;

    for (let task of allTasks) {
      const newTask = await Task.create({ ...task, user: _id });
      await newTask.save();
    }

    return res
      .cookie("token", createJwtToken({ id: _id, chat_id }), cookieOptions)
      .status(200)
      .json("New User, Authentication success");
  }

  const { _id, chat_id } = user;

  if (req.cookies.token) {
    return res.status(200).json("Authentication success");
  }

  return res
    .cookie("token", createJwtToken({ id: _id, chat_id }), cookieOptions)
    .status(200)
    .json("Authentication success");
});

export default authenticateUser;
