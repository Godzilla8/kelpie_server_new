import "dotenv/config";
import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 30000, // Set timeout to 30 seconds
        connectTimeoutMS: 30000, // Optional: Timeout for initial connection
      });
    }
    if (process.env.NODE_ENV === "development") {
      await mongoose.connect(process.env.LOCAL_MONGO_URI);
    }
    console.log("DB connected!");
  } catch (error) {
    console.log("Error connecting DB");
  }
};

export default connectDatabase;
