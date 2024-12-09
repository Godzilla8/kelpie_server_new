import User from "../models/userModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import isTimeElapsed from "../utils/isTimeElapsed.js";

export const claimFarmReward = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id });
  if (user) {
    const { last_claim_date, max_hour_limit, max_reward } = user;
    const isComplete = isTimeElapsed(last_claim_date, max_hour_limit);

    if (isComplete) {
      user.total_reward += max_reward;
      user.last_claim_date = new Date();
      await user.save();
      return res.status(200).json("Claimed successfully.");
    }

    return res.status(400).json("Farming session incomplete.");
  }
});
