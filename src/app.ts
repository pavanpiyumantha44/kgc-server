import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRouter from "./routes/auth"; // ensure default export
import serviceRouter from "./routes/serviceRoute";

// ------------------- CONFIG -------------------
console.log("🟢 APP LOADED");
const APP_URL = process.env.APP_URL
//const APP_URL = "http://localhost:5173";

const app: Application = express();

// ------------------- MIDDLEWARE -------------------

// Security headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: APP_URL,
    credentials: true,
    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);

// JSON body parsing
app.use(express.json());

// Logger for development
app.use(morgan("dev"));

// ------------------- ROUTES -------------------
app.use("/api/auth", authRouter);
app.use("/api/service",serviceRouter);

// ------------------- ERROR HANDLING -------------------

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = err instanceof Error ? err.message : "Internal server error";
  res.status(500).json({ message });
});

export default app;
