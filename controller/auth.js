import "dotenv/config";
import validateTelegramData from "../utils/validateTelegramData.js";
import User from "../models/userModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import Task from "../models/taskModel.js";
import { allTasks } from "../utils/taskList.js";
import { createJwtToken } from "../utils/createJwtToken.js";
import isTimeElapsed from "../utils/isTimeElapsed.js";

const authenticateUser = asyncErrorHandler(async (req, res, next) => {
  const { initData } = req.body;
  const validatedUser = validateTelegramData(initData);
  if (!validatedUser.id) return res.status(401).json("Error validating user");

  const user = await User.findOne({ chat_id: validatedUser.id });

  if (!user) {
    const { username, id, first_name, last_name } = validatedUser;
    const newUser = new User({
      username,
      chat_id: id,
      full_name: first_name + " " + last_name,
      referrer_id: "kelpie",
    });

    await newUser.save();
    const { _id, chat_id } = newUser;

    for (let task of allTasks) {
      const newTask = new Task({ ...task, user: _id });
      await newTask.save();
    }

    const accessToken = createJwtToken({ id: _id, chat_id }, process.env.JWT_SECRET, "30m");
    newUser.accessToken = accessToken;
    newUser.tokenCreationDate = new Date();
    await newUser.save();
    res.status(200).json({ accessToken });
  }

  const { _id, chat_id, tokenCreationDate, accessToken } = user;
  const isJWTExpired = isTimeElapsed(tokenCreationDate, 1800);
  let token = accessToken;

  if (isJWTExpired || !accessToken) {
    token = createJwtToken({ id: _id, chat_id }, process.env.JWT_SECRET, "30m");
    user.tokenCreationDate = new Date();
    user.accessToken = token;
    await user.save();
  }

  return res.status(200).json({ accessToken: token });
});

export default authenticateUser;
