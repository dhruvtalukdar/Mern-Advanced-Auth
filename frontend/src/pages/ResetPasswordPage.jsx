import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Loader, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import AuthLayout from "../components/AuthLayout";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [success, setSuccess] = useState(false);

	const { token } = useParams();
	const navigate = useNavigate();
	const { resetPassword, isLoading, error } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		try {
			await resetPassword(token, password);
			setSuccess(true);
			toast.success("Password reset successful!");
		} catch (error) {
			// handled by store
		}
	};

	if (success) {
		return (
			<AuthLayout title="Password reset!" subtitle="Your password has been changed successfully">
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
					<div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
						<CheckCircle size={32} className="text-green-600 dark:text-green-400" />
					</div>
					<Link to="/login" className="btn-primary inline-block">
						Sign in with new password
					</Link>
				</motion.div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout title="Reset password" subtitle="Enter your new password">
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">New Password</label>
						<div className="relative">
							<Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
							<input
								type={showPassword ? "text" : "password"}
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="input-field pl-10 pr-10"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Confirm Password</label>
						<div className="relative">
							<Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
							<input
								type={showPassword ? "text" : "password"}
								placeholder="••••••••"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="input-field pl-10"
								required
							/>
						</div>
					</div>

					{error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 dark:text-red-400 p-3 rounded-lg">{error}</p>}

					<button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
						{isLoading ? <Loader size={18} className="animate-spin" /> : "Reset Password"}
					</button>
				</form>
			</motion.div>
		</AuthLayout>
	);
};

export default ResetPasswordPage;
