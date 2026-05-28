import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import AuthLayout from "../components/AuthLayout";
import toast from "react-hot-toast";
import axios from "axios";

const API_PORT = import.meta.env.VITE_API_PORT || 5000;
const API_URL = import.meta.env.MODE === "development" ? `http://localhost:${API_PORT}/api/auth` : "/api/auth";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	// 2FA step (email/password login)
	const [requires2FA, setRequires2FA] = useState(false);
	const [totpCode, setTotpCode] = useState("");
	const totpInputRef = useRef(null);

	// OAuth 2FA step (Google login with 2FA)
	const [searchParams] = useSearchParams();
	const [oauthPendingToken, setOauthPendingToken] = useState(() => searchParams.get("oauth2fa") || null);
	const [oauthTotpCode, setOauthTotpCode] = useState("");
	const [oauthError, setOauthError] = useState(null);
	const [oauthLoading, setOauthLoading] = useState(false);
	const oauthTotpRef = useRef(null);

	const navigate = useNavigate();
	const { login, isLoading, error } = useAuthStore();

	// Auto-focus OTP input when 2FA screen shows
	useEffect(() => {
		if (requires2FA && totpInputRef.current) {
			totpInputRef.current.focus();
		}
	}, [requires2FA]);

	// Auto-focus OAuth TOTP input
	useEffect(() => {
		if (oauthPendingToken && oauthTotpRef.current) {
			oauthTotpRef.current.focus();
		}
	}, [oauthPendingToken]);

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const result = await login(email, password);
			if (result?.requires2FA) {
				setRequires2FA(true);
				return; // Don't navigate — show 2FA step
			}
			navigate("/dashboard");
			toast.success("Welcome back!");
		} catch (error) {
			// error handled by store
		}
	};

	const handle2FASubmit = async (e) => {
		e.preventDefault();
		try {
			const result = await login(email, password, totpCode);
			if (result?.success) {
				navigate("/dashboard");
				toast.success("Welcome back!");
			}
		} catch (error) {
			setTotpCode(""); // Clear code on failure so user can retry
		}
	};

	const handleGoogleLogin = () => {
		window.location.href = `${import.meta.env.MODE === "development" ? `http://localhost:${API_PORT}` : ""}/api/auth/google`;
	};

	const handleOAuth2FASubmit = async (e) => {
		e.preventDefault();
		setOauthError(null);
		setOauthLoading(true);
		try {
			const response = await axios.post(`${API_URL}/verify-oauth-2fa`, {
				pendingToken: oauthPendingToken,
				totpCode: oauthTotpCode,
			});
			if (response.data.success) {
				// Re-check auth to load user into store
				await useAuthStore.getState().checkAuth();
				navigate("/dashboard");
				toast.success("Welcome back!");
			}
		} catch (err) {
			setOauthError(err.response?.data?.message || "Verification failed");
			setOauthTotpCode("");
		} finally {
			setOauthLoading(false);
		}
	};

	// ── OAuth 2FA Verification Step ───────────────────────────────────────────
	if (oauthPendingToken) {
		return (
			<AuthLayout title="Two-Factor Authentication" subtitle="Your Google account has 2FA enabled. Enter your code to continue.">
				<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
					{/* Back button */}
					<button
						onClick={() => { setOauthPendingToken(null); setOauthTotpCode(""); setOauthError(null); navigate("/login", { replace: true }); }}
						className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 mb-6 transition-colors"
					>
						<ArrowLeft size={16} />
						Back to login
					</button>

					{/* Icon */}
					<div className="flex justify-center mb-6">
						<div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
							<ShieldCheck size={32} className="text-primary-600 dark:text-primary-400" />
						</div>
					</div>

					<form onSubmit={handleOAuth2FASubmit} className="space-y-5">
						<div>
							<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
								Verification Code
							</label>
							<input
								ref={oauthTotpRef}
								type="text"
								inputMode="numeric"
								autoComplete="one-time-code"
								value={oauthTotpCode}
								onChange={(e) => setOauthTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
								placeholder="000000"
								className="input-field text-center text-2xl tracking-[0.3em] font-mono"
								maxLength={6}
								required
							/>
							<p className="text-xs text-surface-400 dark:text-surface-500 mt-2 text-center">
								Open your authenticator app (Google Authenticator, Authy, etc.)
							</p>
						</div>

						{oauthError && (
							<p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 dark:text-red-400 p-3 rounded-lg">
								{oauthError}
							</p>
						)}

						<button
							type="submit"
							disabled={oauthLoading || oauthTotpCode.length !== 6}
							className="btn-primary w-full flex items-center justify-center gap-2"
						>
							{oauthLoading ? <Loader size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
							Verify & Sign In
						</button>
					</form>
				</motion.div>
			</AuthLayout>
		);
	}

	// ── 2FA Verification Step (email/password login) ──────────────────────────
	if (requires2FA) {
		return (
			<AuthLayout title="Two-Factor Authentication" subtitle="Enter the 6-digit code from your authenticator app">
				<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
					{/* Back button */}
					<button
						onClick={() => { setRequires2FA(false); setTotpCode(""); }}
						className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 mb-6 transition-colors"
					>
						<ArrowLeft size={16} />
						Back to login
					</button>

					{/* Icon */}
					<div className="flex justify-center mb-6">
						<div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
							<ShieldCheck size={32} className="text-primary-600 dark:text-primary-400" />
						</div>
					</div>

					<form onSubmit={handle2FASubmit} className="space-y-5">
						<div>
							<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
								Verification Code
							</label>
							<input
								ref={totpInputRef}
								type="text"
								inputMode="numeric"
								autoComplete="one-time-code"
								value={totpCode}
								onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
								placeholder="000000"
								className="input-field text-center text-2xl tracking-[0.3em] font-mono"
								maxLength={6}
								required
							/>
							<p className="text-xs text-surface-400 dark:text-surface-500 mt-2 text-center">
								Open your authenticator app (Google Authenticator, Authy, etc.)
							</p>
						</div>

						{error && (
							<p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 dark:text-red-400 p-3 rounded-lg">
								{error}
							</p>
						)}

						<button
							type="submit"
							disabled={isLoading || totpCode.length !== 6}
							className="btn-primary w-full flex items-center justify-center gap-2"
						>
							{isLoading ? <Loader size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
							Verify & Sign In
						</button>
					</form>
				</motion.div>
			</AuthLayout>
		);
	}

	// ── Normal Login Step ─────────────────────────────────────────────────────
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
