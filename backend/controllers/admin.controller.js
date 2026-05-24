import UserRepository from "../repositories/user.repository.js";

const EXCLUDE_FIELDS = ["password", "resetPasswordToken", "resetPasswordExpiresAt", "verificationToken", "verificationTokenExpiresAt"];

export const getAllUsers = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 20;
		const offset = (page - 1) * limit;

		const users = await UserRepository.findAll({
			order: [["createdAt", "DESC"]],
			offset,
			limit,
			exclude: EXCLUDE_FIELDS,
		});

		const total = await UserRepository.countDocuments();

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
		const user = await UserRepository.findById(req.params.id, EXCLUDE_FIELDS);
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

		if (id === req.userId) {
			return res.status(400).json({ success: false, message: "Cannot change your own role" });
		}

		const user = await UserRepository.findByIdAndUpdate(id, { role }, { new: true });

		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, message: "User role updated", user: UserRepository.toSafeObject(user) });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		if (id === req.userId) {
			return res.status(400).json({ success: false, message: "Cannot delete your own account from admin panel" });
		}

		const user = await UserRepository.findByIdAndDelete(id);
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
		const totalUsers = await UserRepository.countDocuments();
		const verifiedUsers = await UserRepository.countDocuments({ isVerified: true });
		const adminUsers = await UserRepository.countDocuments({ role: "admin" });

		const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
		const newUsers = await UserRepository.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

		const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
		const activeUsers = await UserRepository.countDocuments({ lastLogin: { $gte: sevenDaysAgo } });

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
