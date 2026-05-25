import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, ShieldCheck, TrendingUp, Activity, Trash2, ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
const API_PORT = import.meta.env.VITE_API_PORT || 5000;

const API_URL = import.meta.env.MODE === "development" ? `http://localhost:${API_PORT}/api/admin` : "/api/admin";

const AdminPage = () => {
	const [stats, setStats] = useState(null);
	const [users, setUsers] = useState([]);
	const [pagination, setPagination] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async (page = 1) => {
		try {
			const [statsRes, usersRes] = await Promise.all([
				axios.get(`${API_URL}/stats`),
				axios.get(`${API_URL}/users?page=${page}&limit=10`),
			]);
			setStats(statsRes.data.stats);
			setUsers(usersRes.data.users);
			setPagination(usersRes.data.pagination);
		} catch (error) {
			toast.error("Failed to load admin data");
		} finally {
			setLoading(false);
		}
	};

	const handleRoleChange = async (userId, newRole) => {
		try {
			await axios.put(`${API_URL}/users/${userId}/role`, { role: newRole });
			setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
			toast.success("Role updated");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to update role");
		}
	};

	const handleDeleteUser = async (userId, userName) => {
		if (!window.confirm(`Delete user "${userName}"? This cannot be undone.`)) return;
		try {
			await axios.delete(`${API_URL}/users/${userId}`);
			setUsers(users.filter((u) => u._id !== userId));
			toast.success("User deleted");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete user");
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-surface-50 dark:bg-surface-950">
				<Navbar />
				<div className="flex items-center justify-center py-20">
					<div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-surface-50 dark:bg-surface-950">
			<Navbar />

			<main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
					<h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-8">Admin Panel</h1>

					{/* Stats Grid */}
					{stats && (
						<div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
							<StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="primary" />
							<StatCard icon={UserCheck} label="Verified" value={stats.verifiedUsers} color="green" />
							<StatCard icon={ShieldCheck} label="Admins" value={stats.adminUsers} color="purple" />
							<StatCard icon={TrendingUp} label="New (30d)" value={stats.newUsers} color="blue" />
							<StatCard icon={Activity} label="Active (7d)" value={stats.activeUsers} color="orange" />
						</div>
					)}

					{/* Users Table */}
					<div className="card overflow-hidden">
						<div className="p-5 border-b border-surface-200 dark:border-surface-700">
							<h2 className="text-lg font-semibold text-surface-900 dark:text-white">All Users</h2>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-surface-50 dark:bg-surface-800/50">
									<tr>
										<th className="text-left px-5 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">User</th>
										<th className="text-left px-5 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Status</th>
										<th className="text-left px-5 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Role</th>
										<th className="text-left px-5 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Joined</th>
										<th className="text-right px-5 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-surface-100 dark:divide-surface-700">
									{users.map((u) => (
										<tr key={u._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30">
											<td className="px-5 py-4">
												<div className="flex items-center gap-3">
													<div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
														<span className="text-xs font-bold text-primary-700 dark:text-primary-300">
															{u.name?.charAt(0).toUpperCase()}
														</span>
													</div>
													<div>
														<p className="text-sm font-medium text-surface-900 dark:text-white">{u.name}</p>
														<p className="text-xs text-surface-500">{u.email}</p>
													</div>
												</div>
											</td>
											<td className="px-5 py-4">
												<span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
													u.isVerified
														? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
														: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
												}`}>
													{u.isVerified ? "Verified" : "Unverified"}
												</span>
											</td>
											<td className="px-5 py-4">
												<div className="relative inline-block">
													<select
														value={u.role}
														onChange={(e) => handleRoleChange(u._id, e.target.value)}
														className="appearance-none bg-transparent border border-surface-200 dark:border-surface-700 rounded-md px-3 py-1 pr-7 text-xs font-medium text-surface-700 dark:text-surface-300 cursor-pointer"
													>
														<option value="user">User</option>
														<option value="admin">Admin</option>
													</select>
													<ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
												</div>
											</td>
											<td className="px-5 py-4 text-sm text-surface-500">
												{new Date(u.createdAt).toLocaleDateString()}
											</td>
											<td className="px-5 py-4 text-right">
												<button
													onClick={() => handleDeleteUser(u._id, u.name)}
													className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/50 text-surface-400 hover:text-red-600 transition-colors"
													title="Delete user"
												>
													<Trash2 size={16} />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Pagination */}
						{pagination.pages > 1 && (
							<div className="p-4 flex items-center justify-between border-t border-surface-100 dark:border-surface-700">
								<p className="text-sm text-surface-500">
									Page {pagination.page} of {pagination.pages} ({pagination.total} users)
								</p>
								<div className="flex gap-2">
									<button
										disabled={pagination.page <= 1}
										onClick={() => fetchData(pagination.page - 1)}
										className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-50"
									>
										Previous
									</button>
									<button
										disabled={pagination.page >= pagination.pages}
										onClick={() => fetchData(pagination.page + 1)}
										className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-50"
									>
										Next
									</button>
								</div>
							</div>
						)}
					</div>
				</motion.div>
			</main>
		</div>
	);
};

const StatCard = ({ icon: Icon, label, value, color }) => {
	const colorMap = {
		primary: "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400",
		green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
		purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
		blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
		orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
	};

	return (
		<div className="card p-4">
			<div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colorMap[color]}`}>
				<Icon size={18} />
			</div>
			<p className="text-2xl font-bold text-surface-900 dark:text-white">{value}</p>
			<p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{label}</p>
		</div>
	);
};

export default AdminPage;
