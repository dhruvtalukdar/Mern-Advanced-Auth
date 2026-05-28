import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
	resendVerificationCode,
	refreshToken,
	logoutAll,
	verifyOAuth2FA,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { validate } from "../middleware/validate.js";
import { authLimiter, passwordResetLimiter } from "../middleware/rateLimiter.js";
import {
	signupSchema,
	loginSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
	verifyEmailSchema,
} from "../validators/auth.validator.js";
import { generateTokenAndSetCookie, generateRefreshToken } from "../utils/generateTokenAndSetCookie.js";
import UserRepository from "../repositories/user.repository.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", authLimiter, validate(signupSchema), signup);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.post("/logout-all", verifyToken, logoutAll);
router.post("/refresh-token", refreshToken);
router.post("/verify-oauth-2fa", authLimiter, verifyOAuth2FA);

router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/resend-verification", authLimiter, resendVerificationCode);
router.post("/forgot-password", passwordResetLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password/:token", passwordResetLimiter, validate(resetPasswordSchema), resetPassword);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

router.get(
	"/google/callback",
	passport.authenticate("google", { session: false, failureRedirect: "/login" }),
	async (req, res) => {
		try {
			const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

			// If user has 2FA enabled, issue a short-lived pending token and redirect to 2FA challenge
			if (req.user.twoFactorEnabled) {
				const pendingToken = jwt.sign(
					{ userId: UserRepository.getId(req.user), purpose: "oauth-2fa" },
					process.env.JWT_SECRET,
					{ expiresIn: "5m" }
				);
				return res.redirect(`${clientUrl}/login?oauth2fa=${pendingToken}`);
			}

			// No 2FA — proceed normally
			const refreshTokenValue = generateRefreshToken();
			req.user.refreshToken = refreshTokenValue;
			req.user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
			await UserRepository.save(req.user);

			generateTokenAndSetCookie(res, UserRepository.getId(req.user), refreshTokenValue);
			res.redirect(clientUrl);
		} catch (error) {
			console.log("Error in Google OAuth callback", error);
			res.redirect("/login?error=oauth_failed");
		}
	}
);

export default router;
