import validateTelegramData from "../utils/validateTelegramData.js";
import User from "../models/userModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import Task from "../models/taskModel.js";
import { allTasks } from "../utils/taskList.js";
import { createJwtToken } from "../utils/createJwtToken.js";
import { setCookieOptions } from "../utils/cookieOptions.js";

const authenticateUser = asyncErrorHandler(async (req, res, next) => {
  const { initData } = req.body;
  const validatedUser = validateTelegramData(initData);

  if (!validatedUser.id) return res.status(401).json("Error validating user");

  const user = await User.findOne({ chat_id: validatedUser.id });
  // const user = await User.findOne({ chat_id: "5903277" });

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

    const token = createJwtToken({ id: _id, chat_id });
    return res.status(200).json({ token: token });
  }

  if (req.cookies.token) return res.status(200).json("User authenticated.");

  const { _id, chat_id } = user;
  const token = createJwtToken({ id: _id, chat_id });

  console.log(token);

  return res
    .cookie("token", token, setCookieOptions("prod"))
    .status(200)
    .json("User authenticated.");
});

export default authenticateUser;
