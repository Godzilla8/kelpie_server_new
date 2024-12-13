import "dotenv/config";
import jwt from "jsonwebtoken";

export const createJwtToken = (args) => {
  const token = jwt.sign(args, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
};
