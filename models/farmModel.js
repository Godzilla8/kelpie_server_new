import { model, Schema } from "mongoose";

const FarmSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },

  max_hour_limit: { type: Number, default: 3600 },

  last_claim_date: { type: Date, default: 100000000 },

  max_reward: { type: Number, default: 100 },

  num_of_claims: { type: Number, default: 0 },

  total_reward: { type: Number, default: 0 },
});

export default model("Farm", FarmSchema);
