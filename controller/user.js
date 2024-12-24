import User from "../models/userModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

export const fetchUser = asyncErrorHandler(async (req, res, next) => {
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
      daily_claim_date,
      streak,
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
      daily_claim_date,
      streak,
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

export const fetchLeaderBoard = asyncErrorHandler(async (req, res, next) => {
  try {
    const result = await User.aggregate([
      {
        $match: {
          // Include users with total_reward >= 0
          total_reward: { $gte: 0 },
        },
      },
      {
        $setWindowFields: {
          sortBy: { total_reward: -1 }, // Sort by total_reward in descending order
          output: {
            position: { $denseRank: {} }, // Assign contiguous positions
          },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the MongoDB `_id` field
          username: 1, // Include the username
          full_name: 1,
          chat_id: 1,
          total_reward: 1, // Include the total_reward
          position: 1, // Include the position
        },
      },
    ]);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json("Error fetching leaderboard");
  }
});
