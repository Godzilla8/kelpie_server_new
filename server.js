import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import farmRoutes from "./routes/farmRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
// import connectDatabase from "./dbConnect.js";
import CustomError from "./utils/customError.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import globalErorHandler from "./middleware/errorHandler.js";
import verifyJWT from "./middleware/verifyJwt.js";
import mongoose from "mongoose";

const app = express();

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

await connectDatabase();

process.on("uncaughtException", (err) => {
  console.log(`ERROR NAME: ${err.name}\n ERROR MESSAGE: ${err.message}`);
  console.log("UNCAUGHT EXCEPTION! Server shutting down...");
});

const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(helmet());

if (process.env.NODE_ENV === "production") {
  app.use(cors({ origin: process.env.PROD_SERVER_URL, credentials: true }));
}
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: process.env.LOCAL_ORIGIN, credentials: true }));
}

app.use(express.json());
// app.use(morgan("combined"));

app.get("/", (req, res, next) => {
  res.send("Welcome, server is running");
});

app.use("/api/v1/auth/", authRoutes);
app.use(verifyJWT);
app.use("/api/v1/", userRoutes);
app.use("/api/v1/reward/", farmRoutes);
app.use("/api/v1/task/", taskRoutes);

app.all("*", (req, res, next) => {
  const err = new CustomError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
});

app.use(globalErorHandler);

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});

process.on("unhandledRejection", (err) => {
  console.log(`ERROR NAME: ${err.name}\n ERROR MESSAGE: ${err.message}`);
  console.log("UNHANDLED REJECTION! Server shutting down...");
  server.close(() => process.exit(1));
});
