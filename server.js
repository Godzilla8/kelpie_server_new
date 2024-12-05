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
connectDatabase();
const PORT = process.env.PORT || 3000;
console.log("running");
// app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));

app.use("/", botRoutes);
app.use("/api/v1/reward/", farmRoutes);

app.use(globalErorHandler);

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
