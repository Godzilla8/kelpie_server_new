import "dotenv/config";
import validateTelegramData from "../utils/validateTelegramData.js";
import User from "../models/userModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { createJwtToken } from "../utils/createJwtToken.js";
import isTimeElapsed from "../utils/isTimeElapsed.js";

const authenticateUser = asyncErrorHandler(async (req, res, next) => {
  const { initData } = req.body;
  const validatedUser = await validateTelegramData(initData);
  console.log("before, 401", validatedUser);
  if (!validatedUser) return res.status(401).json("Error validating user");
  console.log("after 401", validatedUser);

  const user = await User.findOne({ chat_id: validatedUser.id });

  if (!user) {
    const { username, id, first_name, last_name } = validatedUser;
    const newUser = User.create({
      username: username ? username : " ",
      chat_id: id,
      full_name: first_name + " " + last_name,
      referrer_id: "KelpieNetwork",
    });

    const { _id, chat_id } = newUser;

    const accessToken = createJwtToken({ id: _id, chat_id }, process.env.JWT_SECRET, "30m");
    newUser.accessToken = accessToken;
    newUser.tokenCreationDate = new Date();
    await newUser.save();
    res.status(200).json({ accessToken });
  }

  const { _id, chat_id } = user;
  let token = user?.accessToken;

  if (!user?.tokenCreationDate || !token) {
    token = createJwtToken({ id: _id, chat_id }, process.env.JWT_SECRET, "30m");
    user.tokenCreationDate = new Date();
    user.accessToken = token;
    await user.save();
    return res.status(200).json({ accessToken: token });
  }

  const isJWTExpired = isTimeElapsed(user?.tokenCreationDate, 1800);

  if (isJWTExpired) {
    token = createJwtToken({ id: _id, chat_id }, process.env.JWT_SECRET, "30m");
    user.tokenCreationDate = new Date();
    user.accessToken = token;
    await user.save();
  }

  return res.status(200).json({ accessToken: token });
});

export default authenticateUser;
