import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema, changePasswordSchema } from "../validators/auth.validator.js";
import {
	getProfile,
	updateProfile,
	changePassword,
	deleteAccount,
	setup2FA,
	verify2FASetup,
	disable2FA,
} from "../controllers/user.controller.js";

const router = express.Router();

// All user routes require authentication
router.use(verifyToken);

router.get("/profile", getProfile);
router.put("/profile", validate(updateProfileSchema), updateProfile);
router.put("/change-password", validate(changePasswordSchema), changePassword);
router.delete("/delete-account", deleteAccount);

// Two-Factor Authentication
router.post("/2fa/setup", setup2FA);
router.post("/2fa/verify", verify2FASetup);
router.post("/2fa/disable", disable2FA);

export default router;
