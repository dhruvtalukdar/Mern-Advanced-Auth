import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children, title, subtitle }) => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-surface-50 dark:bg-surface-950">
			{/* Logo */}
			<Link to="/" className="flex items-center space-x-2 mb-8">
				<div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
					<Shield size={22} className="text-white" />
				</div>
				<span className="text-xl font-bold text-surface-900 dark:text-white">AuthKit Pro</span>
			</Link>

			{/* Card */}
			<div className="w-full max-w-md">
				<div className="card p-8">
					{title && (
						<div className="text-center mb-6">
							<h1 className="text-2xl font-bold text-surface-900 dark:text-white">{title}</h1>
							{subtitle && <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">{subtitle}</p>}
						</div>
					)}
					{children}
				</div>
			</div>
		</div>
	);
};

export default AuthLayout;
