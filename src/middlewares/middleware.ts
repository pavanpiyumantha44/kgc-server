import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

// ---- 1️⃣ Extend Express Request to include user ----
export interface AuthRequest extends Request {
  user?: { id: string; }; // match your JwtPayload
}

// ---- 2️⃣ Middleware ----
const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res
      .status(500)
      .json({ message: "JWT_SECRET is not defined in environment" });
  }

  try {
    // ---- 3️⃣ decoded is typed ----
    const decoded = jwt.verify(token, jwtSecret) as { id: string;};
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;
