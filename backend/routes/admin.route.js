import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";
import { getAllUsers, getUserById, updateUserRole, deleteUser, getStats } from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(verifyToken, requireRole("admin"));

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;
