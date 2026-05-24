import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Loader, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import AuthLayout from "../components/AuthLayout";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const { forgotPassword, isLoading } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await forgotPassword(email);
			setSubmitted(true);
		} catch (error) {
			// handled by store
		}
	};

	if (submitted) {
		return (
			<AuthLayout title="Check your email" subtitle={`We sent a reset link to ${email}`}>
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
					<div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
						<CheckCircle size={32} className="text-green-600 dark:text-green-400" />
					</div>
					<p className="text-sm text-surface-600 dark:text-surface-400 mb-6">
						If an account exists with this email, you'll receive a password reset link shortly.
					</p>
					<Link to="/login" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
						<ArrowLeft size={16} /> Back to login
					</Link>
				</motion.div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout title="Forgot password?" subtitle="Enter your email and we'll send you a reset link">
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email</label>
						<div className="relative">
							<Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
							<input
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="input-field pl-10"
								required
							/>
						</div>
					</div>

					<button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
						{isLoading ? <Loader size={18} className="animate-spin" /> : "Send Reset Link"}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
					<Link to="/login" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium">
						<ArrowLeft size={14} /> Back to login
					</Link>
				</p>
			</motion.div>
		</AuthLayout>
	);
};

export default ForgotPasswordPage;
