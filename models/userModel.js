import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  username: String,
  full_name: String,
  chat_id: { type: String, unique: true },
  referral_id: { type: String, unique: true },
  referrer_id: String,
  referrals: [String],
});

export default model("User", UserSchema);
