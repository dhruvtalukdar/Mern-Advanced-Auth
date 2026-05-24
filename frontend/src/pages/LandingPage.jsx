import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Zap, Lock, Users, Globe, CheckCircle, Database, BookOpen } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const features = [
	{
		icon: Lock,
		title: "Secure Authentication",
		description: "JWT-based auth with HTTP-only cookies, bcrypt hashing, and rate limiting built-in.",
	},
	{
		icon: Globe,
		title: "Google OAuth",
		description: "One-click Google sign-in with automatic account linking for existing users.",
	},
	{
		icon: Users,
		title: "Role-Based Access",
		description: "Built-in admin and user roles with protected routes and middleware.",
	},
	{
		icon: Database,
		title: "MongoDB + PostgreSQL",
		description: "Switch databases with one env variable. Repository pattern keeps your code clean.",
	},
	{
		icon: Zap,
		title: "Email Verification",
		description: "Complete email flow: verification, password reset, and welcome emails.",
	},
	{
		icon: Shield,
		title: "Production Ready",
		description: "Rate limiting, Zod validation, CORS, environment validation, and deployment-ready.",
	},
];

const LandingPage = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />

			{/* Hero Section */}
			<section className="flex-1 flex items-center justify-center px-4 py-20 bg-gradient-to-b from-primary-50 to-white dark:from-surface-900 dark:to-surface-950">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium">
							<Zap size={14} />
							Production-Ready MERN Auth Boilerplate
						</div>

						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-900 dark:text-white leading-tight">
							Ship faster with{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
								AuthKit Pro
							</span>
						</h1>

						<p className="mt-6 text-lg sm:text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
							Complete authentication system with Google OAuth, role-based access, email verification, and dual database support. Stop rebuilding auth — start building your product.
						</p>

						<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
							<Link to="/signup" className="btn-primary text-base py-3 px-8 w-full sm:w-auto">
								Get Started Free
							</Link>
							<Link to="/setup-guide" className="btn-secondary text-base py-3 px-8 w-full sm:w-auto flex items-center justify-center gap-2">
								<BookOpen size={18} />
								Setup Guide
							</Link>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 px-4 bg-white dark:bg-surface-950">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-surface-900 dark:text-white">Everything you need</h2>
						<p className="mt-4 text-surface-600 dark:text-surface-400 max-w-xl mx-auto">
							A complete authentication solution built with security and developer experience in mind.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								className="card p-6 hover:shadow-md transition-shadow"
							>
								<div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
									<feature.icon size={20} className="text-primary-600 dark:text-primary-400" />
								</div>
								<h3 className="text-lg font-semibold text-surface-900 dark:text-white">{feature.title}</h3>
								<p className="mt-2 text-sm text-surface-600 dark:text-surface-400">{feature.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-4 bg-surface-50 dark:bg-surface-900">
				<div className="max-w-3xl mx-auto text-center">
					<h2 className="text-3xl font-bold text-surface-900 dark:text-white">Ready to get started?</h2>
					<p className="mt-4 text-surface-600 dark:text-surface-400">
						Create your free account and explore all features.
					</p>
					<div className="mt-8">
						<Link to="/signup" className="btn-primary text-base py-3 px-8">
							Create Free Account
						</Link>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default LandingPage;
