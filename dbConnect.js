import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.LIVE_MONGO_URI);
    console.log("DB connected!");
  } catch (error) {
    console.log("Error connecting DB");
  }
};

export default connectDatabase;
