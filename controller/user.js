import User from "../models/userModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

export const fetchUser = asyncErrorHandler(async (req, res, next) => {
  console.log("req.user>>>: ", req.user);
  if (req.user.chat_id) {
    const {
      username,
      full_name,
      chat_id,
      referral_id,
      referrer_id,
      max_hour_limit,
      last_claim_date,
      max_reward,
      total_reward,
    } = req.user;

    return res.status(200).json({
      username,
      full_name,
      chat_id,
      referral_id,
      referrer_id,
      max_hour_limit,
      last_claim_date,
      max_reward,
      total_reward,
    });
  }
  return res.status(400).json("User does not exist");
});

export const fetchReferrals = asyncErrorHandler(async (req, res, next) => {
  const user = await User.find(
    { referrer_id: req.user.referral_id },
    { chat_id: 1, username: 1, full_name: 1 }
  )
    .limit(30)
    .sort({ createdAt: -1 });
  return res.status(200).json(user);
});
