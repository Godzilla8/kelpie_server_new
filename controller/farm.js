import Farm from "../models/farmModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

export const claimFarmReward = asyncErrorHandler(async (req, res, next) => {
  const farm = await Farm.findOne({ user: req.user.id });

  if (farm) {
    const { last_claim_date, max_hour_limit, max_reward } = farm;
    const now = new Date.getTime();
    const difference = (now - last_claim_date) / 1000;

    if (difference >= max_hour_limit) {
      total_reward += max_reward;
      return res.status(200).json("Claimed successfully.");
    }

    return res.status(400).json("Farming session incomplete.");
  }
});
