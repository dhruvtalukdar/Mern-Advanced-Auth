import UserRepository from "../repositories/user.repository.js";

export const requireRole = (...roles) => {
	return async (req, res, next) => {
		try {
			const user = await UserRepository.findById(req.userId);
			if (!user) {
				return res.status(404).json({ success: false, message: "User not found" });
			}
			if (!roles.includes(user.role)) {
				return res.status(403).json({ success: false, message: "Access denied. Insufficient permissions." });
			}
			req.user = user;
			next();
		} catch (error) {
			return res.status(500).json({ success: false, message: "Server error" });
		}
	};
};
