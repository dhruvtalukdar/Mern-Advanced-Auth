import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import AuthLayout from "../components/AuthLayout";
import toast from "react-hot-toast";

const API_PORT = import.meta.env.VITE_API_PORT || 5000;

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const { login, isLoading, error } = useAuthStore();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await login(email, password);
			navigate("/dashboard");
			toast.success("Welcome back!");
		} catch (error) {
			// error handled by store
		}
	};

	const handleGoogleLogin = () => {
		window.location.href = `${import.meta.env.MODE === "development" ? `http://localhost:${API_PORT}` : ""}/api/auth/google`;
	};

	return (
		<AuthLayout title="Welcome back" subtitle="Sign in to your account">
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
				{/* Google OAuth Button */}
				<button
					onClick={handleGoogleLogin}
					className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-sm font-medium text-surface-700 dark:text-surface-200"
				>
					<svg className="w-5 h-5" viewBox="0 0 24 24">
						<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
						<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
						<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
						<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
					</svg>
					Continue with Google
				</button>

				{/* Divider */}
				<div className="relative my-6">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-surface-200 dark:border-surface-700"></div>
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-white dark:bg-surface-800 px-2 text-surface-500 dark:text-surface-400">or continue with email</span>
					</div>
				</div>

				{/* Form */}
				<form onSubmit={handleLogin} className="space-y-4">
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

					<div>
						<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Password</label>
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

					<div className="flex items-center justify-end">
						<Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
							Forgot password?
						</Link>
					</div>

					{error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 dark:text-red-400 p-3 rounded-lg">{error}</p>}

					<button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
						{isLoading ? <Loader size={18} className="animate-spin" /> : "Sign In"}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
					Don't have an account?{" "}
					<Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
						Sign up
					</Link>
				</p>
			</motion.div>
		</AuthLayout>
	);
};

export default LoginPage;
