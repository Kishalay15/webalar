import jwt from "jsonwebtoken";

export const generateToken = (userId: String): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET not defined in environment");
  }

  return jwt.sign({ id: userId }, secret, {
    expiresIn: "7d",
  });
};
