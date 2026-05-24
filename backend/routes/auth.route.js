import express from "express";
import passport from "passport";
import {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
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
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", authLimiter, validate(signupSchema), signup);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", logout);

router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/forgot-password", passwordResetLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password/:token", passwordResetLimiter, validate(resetPasswordSchema), resetPassword);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

router.get(
	"/google/callback",
	passport.authenticate("google", { session: false, failureRedirect: "/login" }),
	(req, res) => {
		// Generate JWT and set cookie
		generateTokenAndSetCookie(res, req.user._id);
		// Redirect to frontend dashboard
		res.redirect(process.env.CLIENT_URL || "http://localhost:5173");
	}
);

export default router;
