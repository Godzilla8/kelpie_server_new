import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: String,
    full_name: String,
    chat_id: { type: String, unique: true },
    referral_id: { type: String, unique: true },
    referrer_id: String,
    referral_count: Number,
    max_hour_limit: { type: Number, default: 3600 },
    last_claim_date: { type: Date, default: new Date(1000000000000) },
    max_reward: { type: Number, default: 100 },
    num_of_claims: { type: Number, default: 0 },
    total_reward: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
