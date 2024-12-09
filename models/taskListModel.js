import { Schema, model } from "mongoose";

const TaskListSchema = new Schema({
  type: String,
  title: String,
  desc: String,
  reward: Number,
  link: String,
});

export default model("TaskList", TaskListSchema);
