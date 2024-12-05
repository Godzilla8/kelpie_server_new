import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import farmRoutes from "./routes/farmRoutes.js";
import botRoutes from "./routes/botRoutes.js";
import connectDatabase from "./dbConnect.js";
import globalErorHandler from "./middleware/errorHandler.js";

const app = express();

process.on("uncaughtException", (err) => {
  console.log(`ERROR NAME: ${err.name}\n ERROR MESSAGE: ${err.message}`);
  console.log("UNCAUGHT EXCEPTION! Server shutting down...");
});

connectDatabase();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));

app.use("/", botRoutes);
app.use("/api/v1/reward/", farmRoutes);

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
