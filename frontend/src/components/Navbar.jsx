import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../context/ThemeContext";
import { LogOut, User, Shield, Sun, Moon, Monitor, Menu, X, BookOpen } from "lucide-react";
import { useState } from "react";

const APP_NAME = import.meta.env.VITE_APP_NAME || "AuthKit Pro";

const Navbar = () => {
	const { user, isAuthenticated, logout } = useAuthStore();
	const { theme, setTheme } = useTheme();
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleLogout = async () => {
		await logout();
	};

	const ThemeToggle = () => {
		const icons = { light: Sun, dark: Moon, system: Monitor };
		const next = { light: "dark", dark: "system", system: "light" };
		const Icon = icons[theme];

		return (
			<button
				onClick={() => setTheme(next[theme])}
				className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
				title={`Theme: ${theme}`}
			>
				<Icon size={18} className="text-surface-600 dark:text-surface-400" />
			</button>
		);
	};

	return (
		<nav className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link to="/" className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
							<Shield size={18} className="text-white" />
						</div>
						<span className="text-lg font-bold text-surface-900 dark:text-white">{APP_NAME}</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-4">
						<ThemeToggle />

						{isAuthenticated ? (
							<>
								<Link
									to="/dashboard"
									className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors px-3 py-2 text-sm font-medium"
								>
									Dashboard
								</Link>
								<Link
									to="/setup-guide"
									className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors px-3 py-2 text-sm font-medium flex items-center gap-1"
								>
									<BookOpen size={16} />
									Docs
								</Link>
								{user?.role === "admin" && (
									<Link
										to="/admin"
										className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors px-3 py-2 text-sm font-medium"
									>
										Admin
									</Link>
								)}
								<Link
									to="/profile"
									className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors px-3 py-2 text-sm font-medium"
								>
									<User size={18} />
								</Link>
								<button onClick={handleLogout} className="btn-secondary text-sm py-2 px-3 flex items-center gap-1.5">
									<LogOut size={16} />
									Logout
								</button>
							</>
						) : (
							<>
								<Link
									to="/setup-guide"
									className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors px-3 py-2 text-sm font-medium flex items-center gap-1"
								>
									<BookOpen size={16} />
									Docs
								</Link>
								<Link to="/login" className="btn-secondary text-sm py-2 px-4">
									Log in
								</Link>
								<Link to="/signup" className="btn-primary text-sm py-2 px-4">
									Sign up
								</Link>
							</>
						)}
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden flex items-center gap-2">
						<ThemeToggle />
						<button
							onClick={() => setMobileOpen(!mobileOpen)}
							className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"
						>
							{mobileOpen ? <X size={20} /> : <Menu size={20} />}
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{mobileOpen && (
					<div className="md:hidden py-4 border-t border-surface-200 dark:border-surface-700 animate-slide-down">
						{isAuthenticated ? (
							<div className="space-y-2">
								<Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
									Dashboard
								</Link>
								<Link to="/setup-guide" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
									Setup Guide
								</Link>
								{user?.role === "admin" && (
									<Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
										Admin Panel
									</Link>
								)}
								<Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
									Profile
								</Link>
								<button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
									Logout
								</button>
							</div>
						) : (
							<div className="space-y-2">
								<Link to="/setup-guide" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
									Setup Guide
								</Link>
								<Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
									Log in
								</Link>
								<Link to="/signup" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg bg-primary-600 text-white text-center">
									Sign up
								</Link>
							</div>
						)}
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
