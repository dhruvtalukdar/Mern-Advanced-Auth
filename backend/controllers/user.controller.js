import bcryptjs from "bcryptjs";
import UserRepository from "../repositories/user.repository.js";

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
		await UserRepository.findByIdAndDelete(req.userId);
		res.clearCookie("token");
		res.status(200).json({ success: true, message: "Account deleted successfully" });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server error" });
	}
};
