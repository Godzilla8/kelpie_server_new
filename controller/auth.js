import validateTelegramData from "../utils/validateTelegramData.js";
import User from "../models/userModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import Task from "../models/taskModel.js";
import { allTasks } from "../utils/taskList.js";
import { createJwtToken, cookieOptions } from "../utils/createJwtToken.js";

const authenticateUser = asyncErrorHandler(async (req, res, next) => {
  const { initData } = req.body;
  console.log("cookies", req.cookies);
  const validatedUser = validateTelegramData(initData);

  if (!validatedUser.id) return res.status(401).json("Error validating user");

  const user = await User.findOne({ chat_id: validatedUser.id });
  console.log("user find >>>", user);

  if (!user) {
    console.log("user doesn't exist");

    const { username, id, first_name, last_name } = validatedUser;
    const newUser = new User({
      username,
      chat_id: id,
      full_name: first_name + " " + last_name,
      referrer_id: "kelpie",
    });
    console.log("New User Created");

    await newUser.save();
    const { _id, chat_id } = newUser;

    for (let task of allTasks) {
      const newTask = new Task({ ...task, user: _id });
      await newTask.save();
    }
    console.log("Task Created");

    return res
      .cookie("token", createJwtToken({ id: _id, chat_id }), cookieOptions)
      .status(200)
      .json("New User, Authentication success");
  }
  console.log("user found");
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
