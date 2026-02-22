import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

// ---- 1️⃣ JWT payload type ----
export interface JwtPayload {
  id: string;
}

// ---- 2️⃣ Factory ----
export const AuthFactory = () => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return {
    hashPassword: async (password: string): Promise<string> => {
      return bcrypt.hash(password, 10);
    },

    comparePassword: async (
      password: string,
      hash: string
    ): Promise<boolean> => {
      return bcrypt.compare(password, hash);
    },

    generateToken: (payload: JwtPayload): string => {
      return jwt.sign(payload, jwtSecret, { expiresIn: "1d" });
    },
  };
};
