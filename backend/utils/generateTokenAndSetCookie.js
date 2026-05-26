import jwt from "jsonwebtoken";
import crypto from "crypto";

// Access token: short-lived (15 minutes)
export const generateAccessToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15m",
	});
};

// Refresh token: long-lived, random string stored in DB
export const generateRefreshToken = () => {
	return crypto.randomBytes(40).toString("hex");
};

// Set both tokens as httpOnly cookies
export const generateTokenAndSetCookie = (res, userId, refreshToken = null) => {
	const accessToken = generateAccessToken(userId);

	// Access token cookie (15 min)
	res.cookie("token", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 15 * 60 * 1000, // 15 minutes
	});

	// Refresh token cookie (7 days) — only set if provided
	if (refreshToken) {
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/api/auth", // Only sent to auth endpoints
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});
	}

	return accessToken;
};

// Clear both cookies on logout
export const clearAuthCookies = (res) => {
	res.clearCookie("token");
	res.clearCookie("refreshToken", { path: "/api/auth" });
};
