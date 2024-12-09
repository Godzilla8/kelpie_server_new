import { Schema, model } from "mongoose";

const TaskSchema = new Schema(
  {
    type: String,
    title: String,
    desc: String,
    reward: Number,
    link: String,
    task_id: String,
    click_time: Date,
    status: {
      type: String,
      enum: ["not-started", "in-review", "completed"],
      default: "not-started",
    },
    user: String,
  },
  { timestamps: true }
);

export default model("Task", TaskSchema);
