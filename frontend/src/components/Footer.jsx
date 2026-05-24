import { Shield } from "lucide-react";

const Footer = () => {
	return (
		<footer className="border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center space-x-2">
						<div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
							<Shield size={14} className="text-white" />
						</div>
						<span className="text-sm font-semibold text-surface-900 dark:text-white">AuthKit Pro</span>
					</div>
					<p className="text-sm text-surface-500 dark:text-surface-400">
						&copy; {new Date().getFullYear()} AuthKit Pro. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
