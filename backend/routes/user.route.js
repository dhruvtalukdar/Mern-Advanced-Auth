import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema, changePasswordSchema } from "../validators/auth.validator.js";
import { getProfile, updateProfile, changePassword, deleteAccount } from "../controllers/user.controller.js";

const router = express.Router();

// All user routes require authentication
router.use(verifyToken);

router.get("/profile", getProfile);
router.put("/profile", validate(updateProfileSchema), updateProfile);
router.put("/change-password", validate(changePasswordSchema), changePassword);
router.delete("/delete-account", deleteAccount);

export default router;
