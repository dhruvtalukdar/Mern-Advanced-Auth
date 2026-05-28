import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Lock, Trash2, Loader, Save, ShieldCheck, ShieldOff, X, LogOut } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import axios from "axios";
const API_PORT = import.meta.env.VITE_API_PORT || 5000;

const API_URL =
	import.meta.env.MODE === "development"
		? `http://localhost:${API_PORT}/api/user`
		: `/api/user`;

// ─── Reusable Modal ───────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
	if (!open) return null;
	return (
		<AnimatePresence>
			{open && (
				<>
					{/* Backdrop */}
					<motion.div
						className="fixed inset-0 bg-black/50 z-40"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>
					{/* Panel */}
					<motion.div
						className="fixed inset-0 z-50 flex items-center justify-center p-4"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.15 }}
					>
						<div className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-md p-6">
							<div className="flex items-center justify-between mb-5">
								<h3 className="text-lg font-semibold text-surface-900 dark:text-white">{title}</h3>
								<button onClick={onClose} className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors">
									<X size={20} />
								</button>
							</div>
							{children}
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const ProfilePage = () => {
	const { user, setUser, logoutAll } = useAuthStore();
	const { theme, setTheme } = useTheme();
	const navigate = useNavigate();

	// Profile & password state
	const [name, setName] = useState(user?.name || "");
	const [isUpdating, setIsUpdating] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	// Delete account modal
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deletePassword, setDeletePassword] = useState("");
	const [isDeletingAccount, setIsDeletingAccount] = useState(false);

	// 2FA state
	const [show2FASetupModal, setShow2FASetupModal] = useState(false);
	const [show2FADisableModal, setShow2FADisableModal] = useState(false);
	const [qrCode, setQrCode] = useState(null);
	const [manualSecret, setManualSecret] = useState(null);
	const [totpCode, setTotpCode] = useState("");
	const [disablePassword, setDisablePassword] = useState("");
	const [disableTotpCode, setDisableTotpCode] = useState("");
	const [is2FALoading, setIs2FALoading] = useState(false);

	// ── Handlers ──────────────────────────────────────────────────────────────

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

	const handleDeleteAccount = async (e) => {
		e.preventDefault();
		if (!deletePassword) {
			toast.error("Please enter your password to confirm");
			return;
		}
		setIsDeletingAccount(true);
		try {
			await axios.delete(`${API_URL}/delete-account`, { data: { password: deletePassword } });
			toast.success("Account deleted");
			useAuthStore.getState().clearAuth();
			navigate("/");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete account");
		} finally {
			setIsDeletingAccount(false);
		}
	};

	// 2FA — begin setup (get QR)
	const handle2FASetup = async () => {
		setIs2FALoading(true);
		try {
			const res = await axios.post(`${API_URL}/2fa/setup`);
			setQrCode(res.data.qrCode);
			setManualSecret(res.data.secret);
			setTotpCode("");
			setShow2FASetupModal(true);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to start 2FA setup");
		} finally {
			setIs2FALoading(false);
		}
	};

	// 2FA — verify scan and enable
	const handle2FAVerify = async (e) => {
		e.preventDefault();
		setIs2FALoading(true);
		try {
			const res = await axios.post(`${API_URL}/2fa/verify`, { code: totpCode });
			setUser(res.data.user);
			toast.success("Two-factor authentication enabled!");
			setShow2FASetupModal(false);
			setTotpCode("");
			setQrCode(null);
			setManualSecret(null);
		} catch (error) {
			toast.error(error.response?.data?.message || "Invalid code, please try again");
		} finally {
			setIs2FALoading(false);
		}
	};

	// 2FA — disable
	const handle2FADisable = async (e) => {
		e.preventDefault();
		setIs2FALoading(true);
		try {
			const res = await axios.post(`${API_URL}/2fa/disable`, {
				password: disablePassword || undefined,
				code: disableTotpCode || undefined,
			});
			setUser(res.data.user);
			toast.success("Two-factor authentication disabled");
			setShow2FADisableModal(false);
			setDisablePassword("");
			setDisableTotpCode("");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to disable 2FA");
		} finally {
			setIs2FALoading(false);
		}
	};

	// ── Render ─────────────────────────────────────────────────────────────────

	return (
		<div className="min-h-screen bg-surface-50 dark:bg-surface-950">
			<Navbar />

			<main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
					<h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-8">Profile Settings</h1>

					{/* ── Personal Info ── */}
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
								<input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
							</div>
							<div>
								<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email</label>
								<input type="email" value={user?.email || ""} disabled className="input-field opacity-50 cursor-not-allowed" />
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

					{/* ── Change Password ── */}
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
									<input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field" required />
								</div>
								<div>
									<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">New Password</label>
									<input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" required />
								</div>
								<button type="submit" disabled={isChangingPassword} className="btn-primary flex items-center gap-2">
									{isChangingPassword ? <Loader size={16} className="animate-spin" /> : "Update Password"}
								</button>
							</form>
						</div>
					)}

					{/* ── Two-Factor Authentication ── */}
					<div className="card p-6 mb-6">
						<div className="flex items-center gap-3 mb-4">
							<div className={`w-10 h-10 rounded-lg flex items-center justify-center ${user?.twoFactorEnabled ? "bg-green-100 dark:bg-green-900/30" : "bg-surface-100 dark:bg-surface-800"}`}>
								<ShieldCheck size={20} className={user?.twoFactorEnabled ? "text-green-600 dark:text-green-400" : "text-surface-500 dark:text-surface-400"} />
							</div>
							<div>
								<h2 className="text-lg font-semibold text-surface-900 dark:text-white">Two-Factor Authentication</h2>
								<p className="text-sm text-surface-500 dark:text-surface-400">
									{user?.twoFactorEnabled ? (
										<span className="text-green-600 dark:text-green-400 font-medium">✓ Enabled</span>
									) : (
										"Add an extra layer of security to your account"
									)}
								</p>
							</div>
						</div>

						{user?.twoFactorEnabled ? (
							<button
								onClick={() => setShow2FADisableModal(true)}
								className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
							>
								<ShieldOff size={15} />
								Disable 2FA
							</button>
						) : (
							<button
								onClick={handle2FASetup}
								disabled={is2FALoading}
								className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
							>
								{is2FALoading ? <Loader size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
								Enable 2FA
							</button>
						)}
					</div>

					{/* ── Sessions ── */}
					<div className="card p-6 mb-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
								<LogOut size={20} className="text-blue-600 dark:text-blue-400" />
							</div>
							<div>
								<h2 className="text-lg font-semibold text-surface-900 dark:text-white">Active Sessions</h2>
								<p className="text-sm text-surface-500 dark:text-surface-400">Sign out from all other devices</p>
							</div>
						</div>
						<button
							onClick={async () => {
								try {
									await logoutAll();
									toast.success("Logged out from all devices");
									navigate("/login");
								} catch (error) {
									toast.error("Failed to log out from all devices");
								}
							}}
							className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
						>
							<LogOut size={15} />
							Logout from All Devices
						</button>
					</div>

					{/* ── Danger Zone ── */}
					<div className="card p-6 border border-red-200 dark:border-red-900">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
								<Trash2 size={20} className="text-red-600 dark:text-red-400" />
							</div>
							<div>
								<h2 className="text-lg font-semibold text-surface-900 dark:text-white">Danger Zone</h2>
								<p className="text-sm text-surface-500 dark:text-surface-400">Permanently delete your account</p>
							</div>
						</div>
						<button onClick={() => setShowDeleteModal(true)} className="btn-danger text-sm">
							Delete Account
						</button>
					</div>
				</motion.div>
			</main>

			{/* ══ Modal: Delete Account ══════════════════════════════════════════════ */}
			<Modal open={showDeleteModal} onClose={() => { setShowDeleteModal(false); setDeletePassword(""); }} title="Delete Account">
				<p className="text-sm text-surface-600 dark:text-surface-400 mb-5">
					This action is <strong className="text-red-600 dark:text-red-400">permanent and irreversible</strong>. Enter your password to confirm.
				</p>
				<form onSubmit={handleDeleteAccount} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Your Password</label>
						<input
							type="password"
							value={deletePassword}
							onChange={(e) => setDeletePassword(e.target.value)}
							placeholder="Enter your password"
							className="input-field"
							autoFocus
							required
						/>
					</div>
					<div className="flex gap-3 pt-1">
						<button type="button" onClick={() => { setShowDeleteModal(false); setDeletePassword(""); }} className="btn-secondary flex-1">
							Cancel
						</button>
						<button type="submit" disabled={isDeletingAccount || (!user?.googleId && !deletePassword)} className="btn-danger flex-1 flex items-center justify-center gap-2">
							{isDeletingAccount ? <Loader size={15} className="animate-spin" /> : <Trash2 size={15} />}
							Delete
						</button>
					</div>
				</form>
			</Modal>

			{/* ══ Modal: 2FA Setup ═══════════════════════════════════════════════════ */}
			<Modal open={show2FASetupModal} onClose={() => { setShow2FASetupModal(false); setTotpCode(""); }} title="Set Up Two-Factor Authentication">
				<div className="space-y-5">
					<p className="text-sm text-surface-600 dark:text-surface-400">
						Scan the QR code with <strong className="text-surface-800 dark:text-surface-200">Google Authenticator</strong> or <strong className="text-surface-800 dark:text-surface-200">Authy</strong>, then enter the 6-digit code to confirm.
					</p>

					{qrCode && (
						<div className="flex justify-center">
							<img src={qrCode} alt="2FA QR Code" className="w-44 h-44 rounded-lg border border-surface-200 dark:border-surface-700" />
						</div>
					)}

					{manualSecret && (
						<div className="p-3 bg-surface-100 dark:bg-surface-900 rounded-lg">
							<p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Can't scan? Enter this code manually:</p>
							<code className="text-xs font-mono text-surface-800 dark:text-surface-200 break-all">{manualSecret}</code>
						</div>
					)}

					<form onSubmit={handle2FAVerify} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Verification Code</label>
							<input
								type="text"
								value={totpCode}
								onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
								placeholder="000000"
								className="input-field text-center text-xl tracking-widest font-mono"
								maxLength={6}
								autoFocus
								required
							/>
						</div>
						<button type="submit" disabled={is2FALoading || totpCode.length !== 6} className="btn-primary w-full flex items-center justify-center gap-2">
							{is2FALoading ? <Loader size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
							Enable 2FA
						</button>
					</form>
				</div>
			</Modal>

			{/* ══ Modal: Disable 2FA ════════════════════════════════════════════════ */}
			<Modal open={show2FADisableModal} onClose={() => { setShow2FADisableModal(false); setDisablePassword(""); setDisableTotpCode(""); }} title="Disable Two-Factor Authentication">
				<p className="text-sm text-surface-600 dark:text-surface-400 mb-5">
					Enter your <strong className="text-surface-800 dark:text-surface-200">password</strong> or your current <strong className="text-surface-800 dark:text-surface-200">authenticator code</strong> to confirm.
				</p>
				<form onSubmit={handle2FADisable} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Password</label>
						<input
							type="password"
							value={disablePassword}
							onChange={(e) => setDisablePassword(e.target.value)}
							placeholder="Your account password"
							className="input-field"
						/>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
						<span className="text-xs text-surface-400">or</span>
						<div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
					</div>
					<div>
						<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Authenticator Code</label>
						<input
							type="text"
							value={disableTotpCode}
							onChange={(e) => setDisableTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
							placeholder="000000"
							className="input-field text-center tracking-widest font-mono"
							maxLength={6}
						/>
					</div>
					<div className="flex gap-3 pt-1">
						<button type="button" onClick={() => { setShow2FADisableModal(false); setDisablePassword(""); setDisableTotpCode(""); }} className="btn-secondary flex-1">
							Cancel
						</button>
						<button type="submit" disabled={is2FALoading || (!disablePassword && disableTotpCode.length !== 6)} className="btn-danger flex-1 flex items-center justify-center gap-2">
							{is2FALoading ? <Loader size={15} className="animate-spin" /> : <ShieldOff size={15} />}
							Disable 2FA
						</button>
					</div>
				</form>
			</Modal>
		</div>
	);
};

export default ProfilePage;
