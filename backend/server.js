import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.js";
import scoreRoutes from "./routes/scores.js";
import paymentRoutes from "./routes/payments.js";
import charityRoutes from "./routes/charities.js";
import drawRoutes from "./routes/draws.js";
import adminRoutes from "./routes/admin.js";

connectDB();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: "Too many requests" });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: "Too many auth attempts" });

app.use("/api", limiter);
app.use("/api/auth", authLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/charities", charityRoutes);
app.use("/api/draws", drawRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date() }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
