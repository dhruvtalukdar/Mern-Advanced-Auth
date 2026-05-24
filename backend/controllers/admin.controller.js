import { User } from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 20;
		const skip = (page - 1) * limit;

		const users = await User.find()
			.select("-password -resetPasswordToken -resetPasswordExpiresAt -verificationToken -verificationTokenExpiresAt")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const total = await User.countDocuments();

		res.status(200).json({
			success: true,
			users,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select("-password -resetPasswordToken -resetPasswordExpiresAt -verificationToken -verificationTokenExpiresAt");
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}
		res.status(200).json({ success: true, user });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const updateUserRole = async (req, res) => {
	try {
		const { role } = req.body;
		const { id } = req.params;

		if (!["user", "admin"].includes(role)) {
			return res.status(400).json({ success: false, message: "Invalid role" });
		}

		// Prevent admin from changing their own role
		if (id === req.userId) {
			return res.status(400).json({ success: false, message: "Cannot change your own role" });
		}

		const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");

		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, message: "User role updated", user });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		// Prevent admin from deleting themselves
		if (id === req.userId) {
			return res.status(400).json({ success: false, message: "Cannot delete your own account from admin panel" });
		}

		const user = await User.findByIdAndDelete(id);
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, message: "User deleted successfully" });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const getStats = async (req, res) => {
	try {
		const totalUsers = await User.countDocuments();
		const verifiedUsers = await User.countDocuments({ isVerified: true });
		const adminUsers = await User.countDocuments({ role: "admin" });

		// Users registered in the last 30 days
		const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
		const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

		// Users active in the last 7 days
		const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
		const activeUsers = await User.countDocuments({ lastLogin: { $gte: sevenDaysAgo } });

		res.status(200).json({
			success: true,
			stats: {
				totalUsers,
				verifiedUsers,
				adminUsers,
				newUsers,
				activeUsers,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Server error" });
	}
};
