import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { useTheme } from "./context/ThemeContext";

import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import SetupGuidePage from "./pages/SetupGuidePage";

// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (!user?.isVerified) {
		return <Navigate to="/verify-email" replace />;
	}

	return children;
};

// Admin-only route
const AdminRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (user?.role !== "admin") {
		return <Navigate to="/dashboard" replace />;
	}

	return children;
};

// Redirect authenticated users away from auth pages
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user?.isVerified) {
		return <Navigate to="/dashboard" replace />;
	}

	return children;
};

function App() {
	const { isCheckingAuth, checkAuth, user } = useAuthStore();
	const { setTheme } = useTheme();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	// Sync theme from server-stored preference when user loads
	useEffect(() => {
		if (user?.theme && ["light", "dark", "system"].includes(user.theme)) {
			setTheme(user.theme);
		}
	}, [user?.theme]);

	if (isCheckingAuth) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
				<div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
			</div>
		);
	}

	return (
		<>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<ProfilePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin"
					element={
						<AdminRoute>
							<AdminPage />
						</AdminRoute>
					}
				/>
				<Route
					path="/signup"
					element={
						<RedirectAuthenticatedUser>
							<SignUpPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path="/login"
					element={
						<RedirectAuthenticatedUser>
							<LoginPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path="/setup-guide" element={<SetupGuidePage />} />
				<Route path="/verify-email" element={<EmailVerificationPage />} />
				<Route
					path="/forgot-password"
					element={
						<RedirectAuthenticatedUser>
							<ForgotPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path="/reset-password/:token"
					element={
						<RedirectAuthenticatedUser>
							<ResetPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
			<Toaster
				position="top-center"
				toastOptions={{
					className: "!bg-white dark:!bg-surface-800 !text-surface-900 dark:!text-white !shadow-lg",
				}}
			/>
		</>
	);
}

export default App;
