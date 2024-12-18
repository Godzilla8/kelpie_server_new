import "dotenv/config";
import jwt from "jsonwebtoken";
import CustomError from "../utils/customError.js";
import User from "../models/userModel.js";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return next(new CustomError("User not authenticated", 401));

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return next(new CustomError("Token authentication error", 403));

    const isUser = await User.findOne({ _id: decoded?.id });
    if (!isUser) return next(new CustomError("The user with the given token does not exist", 401));
    req.user = isUser;
    next();
  });
};

export default verifyJWT;
