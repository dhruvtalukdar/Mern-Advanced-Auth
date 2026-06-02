import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Zap, Lock, Users, Globe, Database, BookOpen, RefreshCw, Smartphone, Container, Mail, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const features = [
	{
		icon: Lock,
		title: "Secure Authentication",
		description: "JWT with refresh token rotation, HTTP-only cookies, bcrypt hashing, and rate limiting.",
	},
	{
		icon: Smartphone,
		title: "Two-Factor Auth (2FA)",
		description: "TOTP-based 2FA with Google Authenticator / Authy support and QR code setup.",
	},
	{
		icon: Globe,
		title: "Google OAuth",
		description: "One-click Google sign-in with automatic account linking for existing users.",
	},
	{
		icon: RefreshCw,
		title: "Refresh Token Rotation",
		description: "Short-lived access tokens + long-lived refresh tokens. Logout from all devices instantly.",
	},
	{
		icon: Database,
		title: "MongoDB + PostgreSQL",
		description: "Switch databases with one env variable. Repository pattern keeps your code clean.",
	},
	{
		icon: Users,
		title: "Role-Based Access",
		description: "Built-in admin and user roles with protected routes and middleware guards.",
	},
	{
		icon: Mail,
		title: "Email Verification",
		description: "Mailtrap or Resend provider. Verification codes, password reset, and welcome emails.",
	},
	{
		icon: Container,
		title: "Docker Ready",
		description: "One-command local dev with Docker Compose. Dockerfile for production deployment.",
	},
	{
		icon: Shield,
		title: "Production Ready",
		description: "Helmet security headers, Zod validation, CORS, and deployment-ready configuration.",
	},
];

const screenshotFlows = [
	{
		label: "Email Verification Flow",
		folder: "email-verification-flow",
		count: 7,
	},
	{
		label: "Google Auth Flow",
		folder: "google-auth-flow",
		count: 9,
	},
];

const ScreenshotGallery = () => {
	const [activeFlow, setActiveFlow] = useState(0);
	const [activeIndex, setActiveIndex] = useState(0);

	const flow = screenshotFlows[activeFlow];
	const total = flow.count;

	const handleFlowChange = (i) => {
		setActiveFlow(i);
		setActiveIndex(0);
	};

	const prev = () => setActiveIndex((p) => (p - 1 + total) % total);
	const next = () => setActiveIndex((p) => (p + 1) % total);

	return (
		<div className="flex flex-col items-center gap-6">
			{/* Flow tabs */}
			<div className="flex gap-2 p-1 bg-surface-100 dark:bg-surface-800 rounded-full">
				{screenshotFlows.map((f, i) => (
					<button
						key={f.label}
						onClick={() => handleFlowChange(i)}
						className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
							activeFlow === i
								? "bg-primary-600 text-white shadow"
								: "text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"
						}`}
					>
						{f.label}
					</button>
				))}
			</div>

			{/* Image viewer */}
			<div className="relative w-full max-w-4xl">
				{/* Render all images stacked; only the active one is visible — eliminates flicker from mount/unmount */}
				<div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-surface-200 dark:border-surface-700">
					{Array.from({ length: total }).map((_, i) => (
						<motion.img
							key={`${flow.folder}-${i}`}
							src={`/screenshots/${flow.folder}/${i + 1}.png`}
							alt={`${flow.label} step ${i + 1}`}
							animate={{ opacity: i === activeIndex ? 1 : 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className={`w-full object-cover rounded-2xl ${i === 0 ? "relative" : "absolute inset-0"}`}
							style={{ pointerEvents: i === activeIndex ? "auto" : "none" }}
						/>
					))}
				</div>

				{/* Prev / Next buttons */}
				<button
					onClick={prev}
					className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 dark:bg-surface-800/80 backdrop-blur shadow hover:bg-white dark:hover:bg-surface-700 transition"
				>
					<ChevronLeft size={18} />
				</button>
				<button
					onClick={next}
					className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 dark:bg-surface-800/80 backdrop-blur shadow hover:bg-white dark:hover:bg-surface-700 transition"
				>
					<ChevronRight size={18} />
				</button>
			</div>

			{/* Dot indicators */}
			<div className="flex gap-2">
				{Array.from({ length: total }).map((_, i) => (
					<button
						key={i}
						onClick={() => setActiveIndex(i)}
						className={`w-2 h-2 rounded-full transition-all ${
							i === activeIndex ? "bg-primary-600 w-5" : "bg-surface-300 dark:bg-surface-600"
						}`}
					/>
				))}
			</div>

			<p className="text-sm text-surface-500 dark:text-surface-400">
				{activeIndex + 1} / {total}
			</p>
		</div>
	);
};

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
							Complete authentication system with 2FA, refresh tokens, Google OAuth, role-based access, and dual database support. Stop rebuilding auth - start building your product.
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

			{/* Screenshots Section */}
			<section className="py-20 px-4 bg-surface-50 dark:bg-surface-900">
				<div className="max-w-5xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-surface-900 dark:text-white">See it in action</h2>
						<p className="mt-4 text-surface-600 dark:text-surface-400 max-w-xl mx-auto">
							Step-by-step screenshots of the real authentication flows.
						</p>
					</div>
					<ScreenshotGallery />
				</div>
			</section>

			{/* Gumroad / Purchase Section */}
			<section className="py-20 px-4 bg-gradient-to-br from-primary-600 to-primary-500 dark:from-primary-700 dark:to-primary-600">
				<div className="max-w-3xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						<div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/20 text-white text-sm font-medium">
							<ShoppingCart size={14} />
							Full Source Code
						</div>
						<h2 className="text-3xl sm:text-4xl font-extrabold text-white">Get AuthKit Pro</h2>
						<p className="mt-4 text-primary-100 text-lg max-w-xl mx-auto">
							Download the complete, production-ready source code. One-time purchase. Lifetime updates.
						</p>
						<ul className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-white/90">
							{["Full Source Code", "Email + Google OAuth", "2FA Support", "MongoDB & PostgreSQL", "Docker Ready", "Free Updates"].map((item) => (
								<li key={item} className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
									<Shield size={12} />
									{item}
								</li>
							))}
						</ul>
						<div className="mt-10">
							<a
								href="https://gumroad.com"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold text-base py-3 px-10 rounded-full shadow-lg hover:shadow-xl hover:bg-primary-50 transition-all"
							>
								<ShoppingCart size={18} />
								Buy on Gumroad
							</a>
						</div>
					</motion.div>
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
