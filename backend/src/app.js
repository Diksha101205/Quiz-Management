import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import adminRoutes from "./routes/admin.routes.js";
import attemptRoutes from "./routes/attempt.routes.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import questionRoutes from "./routes/question.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

export const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api", questionRoutes);
app.use("/api", attemptRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.use(notFound);
app.use(errorHandler);

