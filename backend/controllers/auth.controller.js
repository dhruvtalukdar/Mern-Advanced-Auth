import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";

import {
	generateTokenAndSetCookie,
	generateRefreshToken,
	clearAuthCookies,
} from "../utils/generateTokenAndSetCookie.js";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mailtrap/emailService.js";
import UserRepository from "../repositories/user.repository.js";

// Refresh token expiry: 7 days
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export const signup = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		const userAlreadyExists = await UserRepository.findOne({ email });

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = crypto.randomInt(100000, 999999).toString();

		const user = await UserRepository.create({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
		});

		// Generate refresh token and store in DB
		const refreshToken = generateRefreshToken();
		user.refreshToken = refreshToken;
		user.refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
		await UserRepository.save(user);

		generateTokenAndSetCookie(res, UserRepository.getId(user), refreshToken);

		await sendVerificationEmail(user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: UserRepository.toSafeObject(user),
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await UserRepository.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = null;
		user.verificationTokenExpiresAt = null;
		await UserRepository.save(user);

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: UserRepository.toSafeObject(user),
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const login = async (req, res) => {
	const { email, password, totpCode } = req.body;
	try {
		const user = await UserRepository.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		// Check if 2FA is enabled
		if (user.twoFactorEnabled) {
			// If no TOTP code provided, return that 2FA is required
			if (!totpCode) {
				return res.status(200).json({
					success: true,
					requires2FA: true,
					message: "2FA code required",
				});
			}

			// Verify TOTP code
			const verified = speakeasy.totp.verify({
				secret: user.twoFactorSecret,
				encoding: "base32",
				token: totpCode,
				window: 1, // Allow 1 step before/after for clock skew
			});

			if (!verified) {
				return res.status(400).json({ success: false, message: "Invalid 2FA code" });
			}
		}

		// Generate refresh token and store in DB
		const refreshToken = generateRefreshToken();
		user.refreshToken = refreshToken;
		user.refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
		user.lastLogin = new Date();
		await UserRepository.save(user);

		generateTokenAndSetCookie(res, UserRepository.getId(user), refreshToken);

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: UserRepository.toSafeObject(user),
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		// Clear refresh token from DB if user is authenticated
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken) {
			const user = await UserRepository.findOne({ refreshToken });
			if (user) {
				user.refreshToken = null;
				user.refreshTokenExpiresAt = null;
				await UserRepository.save(user);
			}
		}
		clearAuthCookies(res);
		res.status(200).json({ success: true, message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout ", error);
		clearAuthCookies(res);
		res.status(200).json({ success: true, message: "Logged out successfully" });
	}
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await UserRepository.findOne({ email });

		if (!user) {
			// Don't reveal whether a user exists — prevents email enumeration
			return res.status(200).json({ success: true, message: "If an account with that email exists, a password reset link has been sent" });
		}

		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;
		await UserRepository.save(user);

		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "If an account with that email exists, a password reset link has been sent" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await UserRepository.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = null;
		user.resetPasswordExpiresAt = null;
		await UserRepository.save(user);

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const checkAuth = async (req, res) => {
	try {
		const user = await UserRepository.findById(req.userId, ["password"]);
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resendVerificationCode = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await UserRepository.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		if (user.isVerified) {
			return res.status(400).json({ success: false, message: "Email is already verified" });
		}

		// Generate a new verification code
		const verificationToken = crypto.randomInt(100000, 999999).toString();
		user.verificationToken = verificationToken;
		user.verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
		await UserRepository.save(user);

		await sendVerificationEmail(user.email, verificationToken);

		res.status(200).json({ success: true, message: "Verification code sent to your email" });
	} catch (error) {
		console.log("Error in resendVerificationCode ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const refreshToken = async (req, res) => {
	try {
		const token = req.cookies.refreshToken;
		if (!token) {
			return res.status(401).json({ success: false, message: "No refresh token provided" });
		}

		const user = await UserRepository.findOne({
			refreshToken: token,
			refreshTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			clearAuthCookies(res);
			return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
		}

		// Rotate refresh token (issue a new one on each refresh)
		const newRefreshToken = generateRefreshToken();
		user.refreshToken = newRefreshToken;
		user.refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
		await UserRepository.save(user);

		generateTokenAndSetCookie(res, UserRepository.getId(user), newRefreshToken);

		res.status(200).json({ success: true, message: "Token refreshed" });
	} catch (error) {
		console.log("Error in refreshToken ", error);
		clearAuthCookies(res);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const logoutAll = async (req, res) => {
	try {
		const user = await UserRepository.findById(req.userId);
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Revoke all refresh tokens by clearing the stored token
		user.refreshToken = null;
		user.refreshTokenExpiresAt = null;
		await UserRepository.save(user);

		clearAuthCookies(res);
		res.status(200).json({ success: true, message: "Logged out from all devices" });
	} catch (error) {
		console.log("Error in logoutAll ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};
