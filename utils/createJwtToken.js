import "dotenv/config";
import jwt from "jsonwebtoken";

export const createJwtToken = (userData, secret, period) => {
  const token = jwt.sign(userData, secret, { expiresIn: period });
  return token;
};
