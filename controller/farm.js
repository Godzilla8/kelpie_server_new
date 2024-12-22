import User from "../models/userModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import checkStreak from "../utils/checkStreak.js";
import isTimeElapsed from "../utils/isTimeElapsed.js";
import setToMidnight from "../utils/setToMidnight.js";

export const claimFarmReward = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id });
  if (user) {
    const { last_claim_date, max_hour_limit, max_reward } = user;
    const isComplete = isTimeElapsed(last_claim_date, max_hour_limit);

    if (isComplete) {
      user.total_reward += max_reward;
      user.last_claim_date = new Date();
      user.num_of_claims += 1;
      await user.save();
      return res.status(200).json("Claimed successfully.");
    }

    return res.status(400).json("Farming session incomplete.");
  }
});

//
export const claimDailyReward = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id });
  const lastLogin = user.daily_claim_date;
  const today = new Date();

  if (setToMidnight(today) === setToMidnight(lastLogin)) return res.status(204);
  if (!checkStreak(user.daily_claim_date)) user.streak = 0;

  user.daily_claim_date = today;
  user.streak += 1;
  user.total_reward += user.streak * 100;
  await user.save();
  res.status(200).json({ message: "Daily reward claimed!", value: user.streak * 100 });
});

export const claimMemoryGameReward = asyncErrorHandler(async (req, res, next) => {
  const { score } = req.body;

  const user = await User.findOne({ _id: req.user.id });
  user.total_reward += Math.min(score, 200);

  await user.save();
  res.status(200).json("Game reward claimed!");
});
