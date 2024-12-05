import validateTelegramData from "../utils/validateTelegramData.js";
import User from "../models/userModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import jwt from "jsonwebtoken";

const authenticateUser = asyncErrorHandler(async (req, res, next) => {
  const { initData } = req.body;

  const validatedUser = validateTelegramData(initData);

  if (!validatedUser) return res.status(401).json("Error validating user");

  const user = await User.findOne({ chat_id: validatedUser.id });

  if (user) {
    return res.status(200).json({ user, isVerified: true });
  }

  //   Work on this below. Check out validateUser details to make sure they are in order
  const newUser = await User.create(validatedUser);
  const { _id, chat_id } = newUser;
  const authToken = jwt.sign({ _id, chat_id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  return res
    .cookie("token", authToken, { maxAge: 3600, secure: true, httpOnly: true })
    .status(200)
    .json("Authentication success");
});

export default authenticateUser;
