import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Lock, Trash2, Loader, Save } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/user" : "/api/user";

const ProfilePage = () => {
	const { user, setUser } = useAuthStore();
	const { theme, setTheme } = useTheme();
	const navigate = useNavigate();

	const [name, setName] = useState(user?.name || "");
	const [isUpdating, setIsUpdating] = useState(false);

	// Password change
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	const handleUpdateProfile = async (e) => {
		e.preventDefault();
		setIsUpdating(true);
		try {
			const res = await axios.put(`${API_URL}/profile`, { name, theme });
			setUser(res.data.user);
			toast.success("Profile updated!");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to update profile");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleChangePassword = async (e) => {
		e.preventDefault();
		setIsChangingPassword(true);
		try {
			await axios.put(`${API_URL}/change-password`, { currentPassword, newPassword });
			toast.success("Password changed successfully!");
			setCurrentPassword("");
			setNewPassword("");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to change password");
		} finally {
			setIsChangingPassword(false);
		}
	};

	const handleDeleteAccount = async () => {
		if (!window.confirm("Are you sure? This action cannot be undone.")) return;
		try {
			await axios.delete(`${API_URL}/delete-account`);
			toast.success("Account deleted");
			navigate("/");
			window.location.reload();
		} catch (error) {
			toast.error("Failed to delete account");
		}
	};

	return (
		<div className="min-h-screen bg-surface-50 dark:bg-surface-950">
			<Navbar />

			<main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
					<h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-8">Profile Settings</h1>

					{/* Profile Info */}
					<div className="card p-6 mb-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
								<User size={20} className="text-primary-600 dark:text-primary-400" />
							</div>
							<h2 className="text-lg font-semibold text-surface-900 dark:text-white">Personal Information</h2>
						</div>

						<form onSubmit={handleUpdateProfile} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Name</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="input-field"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email</label>
								<input
									type="email"
									value={user?.email || ""}
									disabled
									className="input-field opacity-50 cursor-not-allowed"
								/>
								<p className="text-xs text-surface-400 mt-1">Email cannot be changed</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Theme</label>
								<div className="flex gap-3">
									{["light", "dark", "system"].map((t) => (
										<button
											key={t}
											type="button"
											onClick={() => setTheme(t)}
											className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
												theme === t
													? "bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300"
													: "border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800"
											}`}
										>
											{t.charAt(0).toUpperCase() + t.slice(1)}
										</button>
									))}
								</div>
							</div>

							<button type="submit" disabled={isUpdating} className="btn-primary flex items-center gap-2">
								{isUpdating ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
								Save Changes
							</button>
						</form>
					</div>

					{/* Change Password */}
					{!user?.googleId && (
						<div className="card p-6 mb-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
									<Lock size={20} className="text-orange-600 dark:text-orange-400" />
								</div>
								<h2 className="text-lg font-semibold text-surface-900 dark:text-white">Change Password</h2>
							</div>

							<form onSubmit={handleChangePassword} className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Current Password</label>
									<input
										type="password"
										value={currentPassword}
										onChange={(e) => setCurrentPassword(e.target.value)}
										className="input-field"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">New Password</label>
									<input
										type="password"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										className="input-field"
										required
									/>
								</div>
								<button type="submit" disabled={isChangingPassword} className="btn-primary flex items-center gap-2">
									{isChangingPassword ? <Loader size={16} className="animate-spin" /> : "Update Password"}
								</button>
							</form>
						</div>
					)}

					{/* Danger Zone */}
					<div className="card p-6 border-red-200 dark:border-red-900">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
								<Trash2 size={20} className="text-red-600 dark:text-red-400" />
							</div>
							<div>
								<h2 className="text-lg font-semibold text-surface-900 dark:text-white">Danger Zone</h2>
								<p className="text-sm text-surface-500 dark:text-surface-400">Permanently delete your account</p>
							</div>
						</div>
						<button onClick={handleDeleteAccount} className="btn-danger text-sm">
							Delete Account
						</button>
					</div>
				</motion.div>
			</main>
		</div>
	);
};

export default ProfilePage;
