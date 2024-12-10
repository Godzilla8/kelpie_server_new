import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import farmRoutes from "./routes/farmRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import connectDatabase from "./dbConnect.js";
import CustomError from "./utils/customError.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import globalErorHandler from "./middleware/errorHandler.js";
import verifyJWT from "./middleware/verifyJwt.js";

const app = express();

process.on("uncaughtException", (err) => {
  console.log(`ERROR NAME: ${err.name}\n ERROR MESSAGE: ${err.message}`);
  console.log("UNCAUGHT EXCEPTION! Server shutting down...");
});

connectDatabase();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: process.env.PROD_SERVER_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
// app.use(morgan("combined"));

app.use("/api/v1/", authRoutes);
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
