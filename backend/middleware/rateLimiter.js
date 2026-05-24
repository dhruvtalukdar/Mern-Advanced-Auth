import rateLimit from "express-rate-limit";

// General API limiter
export const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
	message: { success: false, message: "Too many requests, please try again later" },
	standardHeaders: true,
	legacyHeaders: false,
});

// Strict limiter for auth endpoints (login, signup, forgot-password)
export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10,
	message: { success: false, message: "Too many authentication attempts, please try again after 15 minutes" },
	standardHeaders: true,
	legacyHeaders: false,
});

// Very strict limiter for password reset
export const passwordResetLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 3,
	message: { success: false, message: "Too many password reset attempts, please try again after 1 hour" },
	standardHeaders: true,
	legacyHeaders: false,
});
