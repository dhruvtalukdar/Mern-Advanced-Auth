import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";

import { connectDB } from "./db/connectDB.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import passport from "./config/passport.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config();

// Environment validation
const dbType = process.env.DB_TYPE || "mongodb";
const requiredEnvVars = ["JWT_SECRET"];

if (dbType === "mongodb") {
	requiredEnvVars.push("MONGO_URI");
} else if (dbType === "postgres") {
	requiredEnvVars.push("POSTGRES_URI");
} else {
	console.error(`❌ Invalid DB_TYPE: "${dbType}". Must be "mongodb" or "postgres".`);
	process.exit(1);
}

const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
	console.error(`❌ Missing required environment variables: ${missingVars.join(", ")}`);
	process.exit(1);
}

const KNOWN_WEAK_SECRETS = ["your_secret_key", "change_this_secret_in_production", "secret", "jwt_secret"];
if (KNOWN_WEAK_SECRETS.includes(process.env.JWT_SECRET)) {
	if (process.env.NODE_ENV === "production") {
		console.error("❌ FATAL: JWT_SECRET is set to a known weak default. Set a strong random secret before deploying.");
		process.exit(1);
	} else {
		console.warn("⚠️  WARNING: You are using a weak default JWT_SECRET. Change it before going to production.");
	}
}

// Warn if Google OAuth credentials are missing
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
	console.warn("⚠️  WARNING: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set. Google OAuth will not work.");
}

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
	res.status(200).json({ success: true, message: "AuthKit Pro API is running" });
});

// 404 handler for unknown API routes (must be before the SPA wildcard)
app.use("/api/*", (req, res) => {
	res.status(404).json({ success: false, message: "API endpoint not found" });
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	connectDB();
	console.log(`🚀 AuthKit Pro server running on port ${PORT}`);
});
