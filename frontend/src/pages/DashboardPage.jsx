import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import Navbar from "../components/Navbar";
import { Calendar, Mail, Shield, Clock } from "lucide-react";

const DashboardPage = () => {
	const { user } = useAuthStore();

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="min-h-screen bg-surface-50 dark:bg-surface-950">
			<Navbar />

			<main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
					{/* Welcome Header */}
					<div className="mb-8">
						<h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
							Welcome back, {user?.name}
						</h1>
						<p className="mt-2 text-surface-600 dark:text-surface-400">Here's your account overview.</p>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
						<div className="card p-5">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
									<Shield size={20} className="text-primary-600 dark:text-primary-400" />
								</div>
								<div>
									<p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide">Role</p>
									<p className="text-sm font-semibold text-surface-900 dark:text-white capitalize">{user?.role}</p>
								</div>
							</div>
						</div>

						<div className="card p-5">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
									<Mail size={20} className="text-green-600 dark:text-green-400" />
								</div>
								<div>
									<p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide">Email Status</p>
									<p className="text-sm font-semibold text-surface-900 dark:text-white">
										{user?.isVerified ? "Verified" : "Not Verified"}
									</p>
								</div>
							</div>
						</div>

						<div className="card p-5">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
									<Clock size={20} className="text-orange-600 dark:text-orange-400" />
								</div>
								<div>
									<p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide">Last Login</p>
									<p className="text-sm font-semibold text-surface-900 dark:text-white">
										{user?.lastLogin ? formatDate(user.lastLogin) : "—"}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Profile Card */}
					<div className="card p-6">
						<h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Account Details</h2>
						<div className="space-y-4">
							<div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-700">
								<span className="text-sm text-surface-500 dark:text-surface-400">Name</span>
								<span className="text-sm font-medium text-surface-900 dark:text-white">{user?.name}</span>
							</div>
							<div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-700">
								<span className="text-sm text-surface-500 dark:text-surface-400">Email</span>
								<span className="text-sm font-medium text-surface-900 dark:text-white">{user?.email}</span>
							</div>
							<div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-700">
								<span className="text-sm text-surface-500 dark:text-surface-400">Member since</span>
								<span className="text-sm font-medium text-surface-900 dark:text-white">
									{user?.createdAt ? formatDate(user.createdAt) : "—"}
								</span>
							</div>
							<div className="flex items-center justify-between py-3">
								<span className="text-sm text-surface-500 dark:text-surface-400">Auth Method</span>
								<span className="text-sm font-medium text-surface-900 dark:text-white">
									{user?.googleId ? "Google" : "Email & Password"}
								</span>
							</div>
						</div>
					</div>
				</motion.div>
			</main>
		</div>
	);
};

export default DashboardPage;
