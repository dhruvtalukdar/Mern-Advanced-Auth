import bcryptjs from "bcryptjs";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import UserRepository from "../repositories/user.repository.js";
import { clearAuthCookies } from "../utils/generateTokenAndSetCookie.js";

const APP_NAME = process.env.APP_NAME || "AuthKit Pro";

export const getProfile = async (req, res) => {
	try {
		const user = await UserRepository.findById(req.userId, [
			"password",
			"resetPasswordToken",
			"resetPasswordExpiresAt",
			"verificationToken",
			"verificationTokenExpiresAt",
		]);
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}
		res.status(200).json({ success: true, user });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const updateProfile = async (req, res) => {
	try {
		const { name, avatar, theme } = req.body;
		const user = await UserRepository.findById(req.userId);

		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		if (name) user.name = name;
		if (avatar) user.avatar = avatar;
		if (theme) user.theme = theme;

		await UserRepository.save(user);

		res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			user: UserRepository.toSafeObject(user),
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const changePassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;
		const user = await UserRepository.findById(req.userId);

		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		if (!user.password) {
			return res.status(400).json({ success: false, message: "Cannot change password for Google-linked account without existing password. Please use forgot password." });
		}

		const isValid = await bcryptjs.compare(currentPassword, user.password);
		if (!isValid) {
			return res.status(400).json({ success: false, message: "Current password is incorrect" });
		}

		user.password = await bcryptjs.hash(newPassword, 10);
		await UserRepository.save(user);

		res.status(200).json({ success: true, message: "Password changed successfully" });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const deleteAccount = async (req, res) => {
	try {
		const { password } = req.body;
		const user = await UserRepository.findById(req.userId);

		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		// Password-linked accounts must confirm with password
		if (user.password) {
			if (!password) {
				return res.status(400).json({ success: false, message: "Password is required to delete your account" });
			}
			const isValid = await bcryptjs.compare(password, user.password);
			if (!isValid) {
				return res.status(400).json({ success: false, message: "Incorrect password" });
			}
		}

		await UserRepository.findByIdAndDelete(req.userId);
		clearAuthCookies(res);
		res.status(200).json({ success: true, message: "Account deleted successfully" });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// ============================================
// Two-Factor Authentication (2FA)
// ============================================

export const setup2FA = async (req, res) => {
	try {
		const user = await UserRepository.findById(req.userId);
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		if (user.twoFactorEnabled) {
			return res.status(400).json({ success: false, message: "2FA is already enabled" });
		}

		// Generate a new secret
		const secret = speakeasy.generateSecret({
			name: `${APP_NAME} (${user.email})`,
			length: 20,
		});

		// Store the secret temporarily (will be confirmed on verify)
		user.twoFactorSecret = secret.base32;
		await UserRepository.save(user);

		// Generate QR code
		const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

		res.status(200).json({
			success: true,
			message: "Scan the QR code with your authenticator app",
			qrCode: qrCodeDataUrl,
			secret: secret.base32, // For manual entry
		});
	} catch (error) {
		console.log("Error in setup2FA ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const verify2FASetup = async (req, res) => {
	try {
		const { code } = req.body;
		if (!code) {
			return res.status(400).json({ success: false, message: "Verification code is required" });
		}

		const user = await UserRepository.findById(req.userId);
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		if (!user.twoFactorSecret) {
			return res.status(400).json({ success: false, message: "Please setup 2FA first" });
		}

		if (user.twoFactorEnabled) {
			return res.status(400).json({ success: false, message: "2FA is already enabled" });
		}

		// Verify the code
		const verified = speakeasy.totp.verify({
			secret: user.twoFactorSecret,
			encoding: "base32",
			token: code,
			window: 1,
		});

		if (!verified) {
			return res.status(400).json({ success: false, message: "Invalid verification code" });
		}

		// Enable 2FA
		user.twoFactorEnabled = true;
		await UserRepository.save(user);

		res.status(200).json({
			success: true,
			message: "Two-factor authentication enabled successfully",
			user: UserRepository.toSafeObject(user),
		});
	} catch (error) {
		console.log("Error in verify2FASetup ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const disable2FA = async (req, res) => {
	try {
		const { password, code } = req.body;

		const user = await UserRepository.findById(req.userId);
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		if (!user.twoFactorEnabled) {
			return res.status(400).json({ success: false, message: "2FA is not enabled" });
		}

		// Require either password or TOTP code for security
		let isAuthorized = false;

		if (password && user.password) {
			isAuthorized = await bcryptjs.compare(password, user.password);
		}

		if (!isAuthorized && code) {
			isAuthorized = speakeasy.totp.verify({
				secret: user.twoFactorSecret,
				encoding: "base32",
				token: code,
				window: 1,
			});
		}

		if (!isAuthorized) {
			return res.status(400).json({ success: false, message: "Invalid password or 2FA code" });
		}

		// Disable 2FA
		user.twoFactorEnabled = false;
		user.twoFactorSecret = null;
		await UserRepository.save(user);

		res.status(200).json({
			success: true,
			message: "Two-factor authentication disabled",
			user: UserRepository.toSafeObject(user),
		});
	} catch (error) {
		console.log("Error in disable2FA ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};
