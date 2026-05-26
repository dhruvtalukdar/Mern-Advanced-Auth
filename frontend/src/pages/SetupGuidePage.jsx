import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
	Database,
	Server,
	Mail,
	Globe,
	Key,
	Terminal,
	FileCode,
	ChevronDown,
	ChevronRight,
	CheckCircle2,
	Copy,
	ArrowRight,
	Layers,
	Shield,
	Palette,
	Users,
	FolderTree,
	Zap,
} from "lucide-react";

const CodeBlock = ({ code, language = "bash" }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="relative group rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700 my-3">
			<div className="flex items-center justify-between px-4 py-2 bg-surface-100 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
				<span className="text-xs font-mono text-surface-500 dark:text-surface-400">{language}</span>
				<button
					onClick={handleCopy}
					className="text-xs flex items-center gap-1 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
				>
					<Copy size={12} />
					{copied ? "Copied!" : "Copy"}
				</button>
			</div>
			<pre className="p-4 overflow-x-auto bg-surface-50 dark:bg-surface-900 text-sm font-mono text-surface-800 dark:text-surface-200 leading-relaxed">
				<code>{code}</code>
			</pre>
		</div>
	);
};

const Accordion = ({ title, icon: Icon, children, defaultOpen = false }) => {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<div className="card overflow-hidden">
			<button
				onClick={() => setOpen(!open)}
				className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
			>
				<div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
					<Icon size={16} className="text-primary-600 dark:text-primary-400" />
				</div>
				<span className="flex-1 font-semibold text-surface-900 dark:text-white">{title}</span>
				{open ? (
					<ChevronDown size={18} className="text-surface-400" />
				) : (
					<ChevronRight size={18} className="text-surface-400" />
				)}
			</button>
			{open && <div className="px-5 pb-5 border-t border-surface-100 dark:border-surface-700 pt-4">{children}</div>}
		</div>
	);
};

const StepNumber = ({ number }) => (
	<div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
		<span className="text-xs font-bold text-white">{number}</span>
	</div>
);

const SetupGuidePage = () => {
	return (
		<div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-950">
			<Navbar />

			<main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
					{/* Header */}
					<div className="mb-10">
						<h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white">Setup Guide</h1>
						<p className="mt-3 text-lg text-surface-600 dark:text-surface-400">
							Everything you need to configure and deploy AuthKit Pro in your project.
						</p>
					</div>

					{/* Quick Overview */}
					<div className="card p-6 mb-8">
						<h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
							<Zap size={20} className="text-primary-600 dark:text-primary-400" />
							Quick Overview
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
							{[
								{ label: "Database", value: "MongoDB or PostgreSQL", icon: Database },
								{ label: "Auth", value: "JWT + Google OAuth", icon: Key },
								{ label: "Email", value: "Mailtrap or Resend", icon: Mail },
								{ label: "Frontend", value: "React + Tailwind", icon: Palette },
								{ label: "Backend", value: "Express + Node.js", icon: Server },
								{ label: "Roles", value: "Admin & User", icon: Users },
							].map((item) => (
								<div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-900">
									<item.icon size={16} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
									<div>
										<p className="text-xs text-surface-500 dark:text-surface-400">{item.label}</p>
										<p className="text-sm font-medium text-surface-900 dark:text-white">{item.value}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Steps */}
					<div className="space-y-4">
						{/* Step 1: Installation */}
						<Accordion title="Step 1 — Installation" icon={Terminal} defaultOpen={true}>
							<div className="space-y-4 text-sm text-surface-700 dark:text-surface-300">
								<div className="flex items-start gap-3">
									<StepNumber number="1" />
									<div className="flex-1">
										<p className="font-medium text-surface-900 dark:text-white">Clone & install dependencies</p>
										<CodeBlock
											code={`git clone <your-repo-url>\ncd authkit-pro\nnpm install\nnpm install --prefix frontend`}
										/>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<StepNumber number="2" />
									<div className="flex-1">
										<p className="font-medium text-surface-900 dark:text-white">Create your environment file</p>
										<CodeBlock code={`cp .env.example .env`} />
										<p className="mt-2 text-surface-500 dark:text-surface-400">
											Then open <code className="px-1.5 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">.env</code> and fill in your values (see sections below).
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<StepNumber number="3" />
									<div className="flex-1">
										<p className="font-medium text-surface-900 dark:text-white">Run the development servers</p>
										<CodeBlock code={`# Backend (from root)\nnpm run dev\n\n# Frontend (separate terminal)\ncd frontend\nnpm run dev`} />
										<p className="mt-2 text-surface-500 dark:text-surface-400">
											Backend runs on <code className="px-1.5 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">http://localhost:5000</code>, frontend on <code className="px-1.5 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">http://localhost:5173</code>.
										</p>
									</div>
								</div>
							</div>
						</Accordion>

						{/* Step 2: Database Setup */}
						<Accordion title="Step 2 — Database Setup (MongoDB or PostgreSQL)" icon={Database}>
							<div className="space-y-6 text-sm text-surface-700 dark:text-surface-300">
								<p>
									AuthKit Pro supports <strong className="text-surface-900 dark:text-white">both MongoDB and PostgreSQL</strong>. Switch between them with a single environment variable{" "}
									<code className="px-1.5 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs font-semibold">DB_TYPE</code>.
								</p>

								{/* MongoDB Option */}
								<div className="border border-surface-200 dark:border-surface-700 rounded-lg p-4">
									<h4 className="font-bold text-surface-900 dark:text-white flex items-center gap-2 mb-3">
										<div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
											<Database size={12} className="text-green-600 dark:text-green-400" />
										</div>
										Option A: MongoDB (Default)
									</h4>
									<p className="mb-3 text-surface-600 dark:text-surface-400">Best for prototyping, flexible schemas, and MongoDB Atlas free tier.</p>
									<CodeBlock code={`DB_TYPE=mongodb\nMONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/authkit_pro`} language="env" />
									<div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
										<p className="text-xs text-blue-700 dark:text-blue-300">
											<strong>Tip:</strong> Get a free MongoDB Atlas cluster at{" "}
											<a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" className="underline">cloud.mongodb.com</a>
										</p>
									</div>
								</div>

								{/* PostgreSQL Option */}
								<div className="border border-surface-200 dark:border-surface-700 rounded-lg p-4">
									<h4 className="font-bold text-surface-900 dark:text-white flex items-center gap-2 mb-3">
										<div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
											<Database size={12} className="text-blue-600 dark:text-blue-400" />
										</div>
										Option B: PostgreSQL
									</h4>
									<p className="mb-3 text-surface-600 dark:text-surface-400">Best for relational data, SQL familiarity, and Supabase/Neon/Railway hosting.</p>
									<CodeBlock code={`DB_TYPE=postgres\nPOSTGRES_URI=postgresql://user:password@localhost:5432/authkit_pro\nPOSTGRES_SSL=false`} language="env" />
									<div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
										<p className="text-xs text-blue-700 dark:text-blue-300">
											<strong>Tip:</strong> Tables are auto-created on first startup. For cloud hosts (Supabase, Neon), set <code>POSTGRES_SSL=true</code>.
										</p>
									</div>
								</div>

								{/* How switching works */}
								<div className="p-4 bg-surface-100 dark:bg-surface-800 rounded-lg">
									<h4 className="font-bold text-surface-900 dark:text-white mb-2 flex items-center gap-2">
										<Layers size={16} className="text-primary-600 dark:text-primary-400" />
										How Database Switching Works
									</h4>
									<ul className="space-y-2 text-surface-600 dark:text-surface-400">
										<li className="flex items-start gap-2">
											<CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
											A <strong className="text-surface-900 dark:text-white">Repository Pattern</strong> abstracts all database operations
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
											Controllers and middleware never talk to the database directly
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
											Change <code className="px-1 py-0.5 bg-white dark:bg-surface-900 rounded text-xs">DB_TYPE</code> in .env, restart the server — done
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
											Both databases use identical API behavior and auth flows
										</li>
									</ul>
								</div>
							</div>
						</Accordion>

						{/* Step 3: Email Setup */}
						<Accordion title="Step 3 — Email Configuration" icon={Mail}>
							<div className="space-y-5 text-sm text-surface-700 dark:text-surface-300">

								{/* Important honest warning */}
								<div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
									<p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">⚠️ Important — Read before configuring email</p>
									<p className="text-xs text-red-600 dark:text-red-300">
										<strong>Both providers (Mailtrap and Resend) require a verified custom domain to send emails to real users in production.</strong>{" "}
										Without a domain, verification emails, password resets, and welcome emails will <em>not</em> reach your users.
										During development this is fine - emails go to a test inbox and you can verify them manually.
									</p>
								</div>

								<p>
									Choose an email provider by setting{" "}
									<code className="px-1.5 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs font-semibold">EMAIL_PROVIDER</code>{" "}
									in your <code className="px-1.5 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">.env</code>.
								</p>

								{/* Mailtrap */}
								<div className="border border-surface-200 dark:border-surface-700 rounded-lg p-4">
									<h4 className="font-bold text-surface-900 dark:text-white flex items-center gap-2 mb-1">
										<div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded flex items-center justify-center">
											<Mail size={12} className="text-amber-600 dark:text-amber-400" />
										</div>
										Option A: Mailtrap <span className="text-xs font-normal text-surface-500 dark:text-surface-400 ml-1">(default)</span>
									</h4>
									<p className="text-xs text-surface-500 dark:text-surface-400 mb-3">
										Perfect for <strong className="text-surface-700 dark:text-surface-300">development & testing</strong>. Emails are caught in a sandbox inbox — they never reach real users, which is ideal while building.
										To send to real users you must verify a domain inside Mailtrap's <em>Email Sending</em> section.
									</p>
									<CodeBlock code={`EMAIL_PROVIDER=mailtrap\nMAILTRAP_TOKEN=your_api_token\nMAILTRAP_INBOX_ID=your_inbox_id\nMAILTRAP_ENDPOINT=https://send.api.mailtrap.io/`} language="env" />
									<p className="text-xs text-surface-500 dark:text-surface-400 mt-2">
										Get your token & inbox ID at{" "}
										<a href="https://mailtrap.io" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 underline">mailtrap.io</a>{" "}
										→ Email Testing → Inboxes.
									</p>
								</div>

								{/* Resend */}
								<div className="border border-surface-200 dark:border-surface-700 rounded-lg p-4">
									<h4 className="font-bold text-surface-900 dark:text-white flex items-center gap-2 mb-1">
										<div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
											<Mail size={12} className="text-green-600 dark:text-green-400" />
										</div>
										Option B: Resend <span className="text-xs font-normal text-surface-500 dark:text-surface-400 ml-1">(free — 3,000 emails/month)</span>
									</h4>
									<p className="text-xs text-surface-500 dark:text-surface-400 mb-3">
										Great free tier for production. <strong className="text-surface-700 dark:text-surface-300">Without a verified domain</strong>, Resend restricts you to sending{" "}
										<em>from</em> <code className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">onboarding@resend.dev</code> and{" "}
										<em>only to your own verified email address</em> — not to any user who signs up.
										To lift this restriction, verify a domain at{" "}
										<a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 underline">resend.com</a>{" "}
										and update <code className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">RESEND_FROM_EMAIL</code>.
									</p>
									<CodeBlock code={`EMAIL_PROVIDER=resend\nRESEND_API_KEY=re_your_api_key\n# Without a domain, keep this as-is (only delivers to your own verified email)\nRESEND_FROM_EMAIL=onboarding@resend.dev`} language="env" />
									<p className="text-xs text-surface-500 dark:text-surface-400 mt-2">
										Get a free API key at{" "}
										<a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 underline">resend.com</a>.
									</p>
								</div>

								{/* Production note */}
								<div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
									<p className="text-xs text-blue-700 dark:text-blue-300">
										<strong>Going to production?</strong> You need a custom domain (e.g. bought on Namecheap, GoDaddy, Cloudflare — from ~$10/yr).
										Verify it with either Mailtrap or Resend and update <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">RESEND_FROM_EMAIL</code>{" "}
										(or switch to <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">mailtrapClient.send()</code> for Mailtrap) to unlock delivery to all users.
									</p>
								</div>
							</div>
						</Accordion>

						{/* Step 4: Google OAuth */}
						<Accordion title="Step 4 — Google OAuth (Optional)" icon={Globe}>
							<div className="space-y-4 text-sm text-surface-700 dark:text-surface-300">
								<p>
									Adds one-click Google sign-in. If you skip this, email/password auth still works perfectly.
								</p>

								<div className="flex items-start gap-3">
									<StepNumber number="1" />
									<div className="flex-1">
										<p className="font-medium text-surface-900 dark:text-white">Go to Google Cloud Console</p>
										<p className="text-surface-500 dark:text-surface-400">
											Visit{" "}
											<a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 underline">console.cloud.google.com</a>
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<StepNumber number="2" />
									<div className="flex-1">
										<p className="font-medium text-surface-900 dark:text-white">Create OAuth credentials</p>
										<p className="text-surface-500 dark:text-surface-400">
											APIs & Services → Credentials → Create OAuth 2.0 Client ID (Web application)
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<StepNumber number="3" />
									<div className="flex-1">
										<p className="font-medium text-surface-900 dark:text-white">Set redirect URI</p>
										<CodeBlock code={`http://localhost:5000/api/auth/google/callback`} />
									</div>
								</div>

								<div className="flex items-start gap-3">
									<StepNumber number="4" />
									<div className="flex-1">
										<p className="font-medium text-surface-900 dark:text-white">Add to .env</p>
										<CodeBlock code={`GOOGLE_CLIENT_ID=your_client_id\nGOOGLE_CLIENT_SECRET=your_client_secret\nGOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback`} language="env" />
									</div>
								</div>
							</div>
						</Accordion>

						{/* Step 5: Project Structure */}
						<Accordion title="Step 5 — Project Structure" icon={FolderTree}>
							<div className="space-y-4 text-sm text-surface-700 dark:text-surface-300">
								<p>Understanding the codebase layout to customize it for your needs.</p>

								<CodeBlock
									language="text"
									code={`authkit-pro/
├── backend/
│   ├── index.js              # Server entry point
│   ├── config/
│   │   └── passport.js       # Google OAuth strategy
│   ├── controllers/
│   │   ├── auth.controller.js    # Signup, login, verify, reset
│   │   ├── user.controller.js    # Profile, password, delete
│   │   └── admin.controller.js   # User management, stats
│   ├── db/
│   │   ├── connectDB.js      # DB connection switcher
│   │   └── postgres.js       # Sequelize connection
│   ├── mailtrap/
│   │   ├── emails.js         # Email sending functions
│   │   └── emailTemplates.js # HTML email templates
│   ├── middleware/
│   │   ├── verifyToken.js    # JWT authentication
│   │   ├── requireRole.js    # Role-based access (admin/user)
│   │   ├── rateLimiter.js    # Rate limiting tiers
│   │   └── validate.js       # Zod validation middleware
│   ├── models/
│   │   ├── user.model.js     # MongoDB/Mongoose schema
│   │   └── user.postgres.js  # PostgreSQL/Sequelize schema
│   ├── repositories/
│   │   └── user.repository.js # DB abstraction layer
│   ├── routes/
│   │   ├── auth.route.js     # Auth endpoints
│   │   ├── user.route.js     # User endpoints
│   │   └── admin.route.js    # Admin endpoints
│   ├── utils/
│   │   └── generateTokenAndSetCookie.js
│   └── validators/
│       └── auth.validator.js # Zod schemas
├── frontend/
│   └── src/
│       ├── App.jsx           # Router & route guards
│       ├── components/       # Reusable UI components
│       ├── context/          # Theme context (dark/light)
│       ├── pages/            # All page components
│       └── store/            # Zustand auth store
├── .env.example              # Environment template
└── package.json              # Root dependencies`}
								/>
							</div>
						</Accordion>

						{/* Step 6: Customization */}
						<Accordion title="Step 6 — Customization Guide" icon={Palette}>
							<div className="space-y-5 text-sm text-surface-700 dark:text-surface-300">
								<div className="space-y-3">
									<h4 className="font-bold text-surface-900 dark:text-white">Change Brand Name & Colors</h4>
									<ul className="space-y-2">
										<li className="flex items-start gap-2">
											<ArrowRight size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
											Brand name: Search & replace "AuthKit Pro" across the project
										</li>
										<li className="flex items-start gap-2">
											<ArrowRight size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
											Colors: Edit <code className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">frontend/tailwind.config.js</code> — change the <code className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">primary</code> color palette
										</li>
										<li className="flex items-start gap-2">
											<ArrowRight size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
											Logo: Replace the Shield icon in <code className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">Navbar.jsx</code> with your own
										</li>
									</ul>
								</div>

								<div className="space-y-3">
									<h4 className="font-bold text-surface-900 dark:text-white">Add New Features</h4>
									<ul className="space-y-2">
										<li className="flex items-start gap-2">
											<ArrowRight size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
											<span>New API route: Create a file in <code className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">backend/routes/</code>, add controller in <code className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">backend/controllers/</code></span>
										</li>
										<li className="flex items-start gap-2">
											<ArrowRight size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
											New page: Create in <code className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">frontend/src/pages/</code>, add route in <code className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">App.jsx</code>
										</li>
										<li className="flex items-start gap-2">
											<ArrowRight size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
											New DB model: Add both Mongoose and Sequelize schemas, create a repository
										</li>
									</ul>
								</div>

								<div className="space-y-3">
									<h4 className="font-bold text-surface-900 dark:text-white">Remove Features You Don't Need</h4>
									<ul className="space-y-2">
										<li className="flex items-start gap-2">
											<ArrowRight size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
											No Google OAuth: Delete passport config, remove Google routes from <code className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">auth.route.js</code>
										</li>
										<li className="flex items-start gap-2">
											<ArrowRight size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
											No admin panel: Remove <code className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">admin.route.js</code>, <code className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">admin.controller.js</code>, and admin page
										</li>
										<li className="flex items-start gap-2">
											<ArrowRight size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
											No PostgreSQL: Remove <code className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">user.postgres.js</code>, <code className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs">postgres.js</code>, and simplify the repository
										</li>
									</ul>
								</div>
							</div>
						</Accordion>

						{/* Step 7: Deployment */}
						<Accordion title="Step 7 — Deployment" icon={Server}>
							<div className="space-y-4 text-sm text-surface-700 dark:text-surface-300">
								<p>Deploy as a single server (backend serves the built frontend).</p>

								<div className="flex items-start gap-3">
									<StepNumber number="1" />
									<div className="flex-1">
										<p className="font-medium text-surface-900 dark:text-white">Build for production</p>
										<CodeBlock code={`npm run build`} />
										<p className="text-surface-500 dark:text-surface-400">This installs all deps and builds the React frontend.</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<StepNumber number="2" />
									<div className="flex-1">
										<p className="font-medium text-surface-900 dark:text-white">Start the production server</p>
										<CodeBlock code={`npm start`} />
									</div>
								</div>

								<div className="flex items-start gap-3">
									<StepNumber number="3" />
									<div className="flex-1">
										<p className="font-medium text-surface-900 dark:text-white">Set production env variables</p>
										<CodeBlock
											language="env"
											code={`NODE_ENV=production\nCLIENT_URL=https://yourdomain.com\nGOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback`}
										/>
									</div>
								</div>

								<div className="p-4 bg-surface-100 dark:bg-surface-800 rounded-lg">
									<h4 className="font-bold text-surface-900 dark:text-white mb-2">Recommended Hosts</h4>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
										{[
											{ name: "Railway", desc: "One-click deploy, great DX" },
											{ name: "Render", desc: "Free tier, auto-deploy" },
											{ name: "Fly.io", desc: "Edge deployment" },
											{ name: "DigitalOcean", desc: "Affordable VPS" },
										].map((host) => (
											<div key={host.name} className="flex items-center gap-2 p-2 rounded bg-white dark:bg-surface-900">
												<CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
												<span>
													<strong className="text-surface-900 dark:text-white">{host.name}</strong>{" "}
													<span className="text-surface-500 dark:text-surface-400">— {host.desc}</span>
												</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</Accordion>

						{/* Step 8: Environment Variables Reference */}
						<Accordion title="Step 8 — Environment Variables Reference" icon={Key}>
							<div className="space-y-4 text-sm text-surface-700 dark:text-surface-300">
								<p>Complete list of all configurable environment variables.</p>

								<div className="overflow-x-auto">
									<table className="w-full text-left text-sm">
										<thead>
											<tr className="border-b border-surface-200 dark:border-surface-700">
												<th className="py-2 pr-4 font-semibold text-surface-900 dark:text-white">Variable</th>
												<th className="py-2 pr-4 font-semibold text-surface-900 dark:text-white">Required</th>
												<th className="py-2 font-semibold text-surface-900 dark:text-white">Description</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-surface-100 dark:divide-surface-800">
											{[
												{ name: "DB_TYPE", required: "Yes", desc: '"mongodb" or "postgres"' },
												{ name: "MONGO_URI", required: "If MongoDB", desc: "MongoDB connection string" },
												{ name: "POSTGRES_URI", required: "If Postgres", desc: "PostgreSQL connection string" },
												{ name: "POSTGRES_SSL", required: "No", desc: "Enable SSL for Postgres (default: false)" },
												{ name: "PORT", required: "No", desc: "Server port (default: 5000)" },
												{ name: "JWT_SECRET", required: "Yes", desc: "Secret key for JWT signing" },
												{ name: "NODE_ENV", required: "No", desc: "development or production" },
												{ name: "EMAIL_PROVIDER", required: "No", desc: '"mailtrap" (default) or "resend"' },
												{ name: "MAILTRAP_TOKEN", required: "If Mailtrap", desc: "Mailtrap API token" },
												{ name: "MAILTRAP_INBOX_ID", required: "If Mailtrap", desc: "Mailtrap test inbox ID" },
												{ name: "MAILTRAP_ENDPOINT", required: "If Mailtrap", desc: "Mailtrap API endpoint" },
												{ name: "RESEND_API_KEY", required: "If Resend", desc: "Resend API key (resend.com)" },
												{ name: "RESEND_FROM_EMAIL", required: "If Resend", desc: "Sender address (needs verified domain for prod)" },
												{ name: "CLIENT_URL", required: "No", desc: "Frontend URL (default: localhost:5173)" },
												{ name: "GOOGLE_CLIENT_ID", required: "No", desc: "Google OAuth Client ID" },
												{ name: "GOOGLE_CLIENT_SECRET", required: "No", desc: "Google OAuth Client Secret" },
												{ name: "GOOGLE_CALLBACK_URL", required: "No", desc: "Google OAuth callback URL" },
											].map((row) => (
												<tr key={row.name}>
													<td className="py-2 pr-4">
														<code className="px-1.5 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-xs font-mono">{row.name}</code>
													</td>
													<td className="py-2 pr-4 text-surface-600 dark:text-surface-400">{row.required}</td>
													<td className="py-2 text-surface-600 dark:text-surface-400">{row.desc}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</Accordion>

						{/* API Endpoints */}
						<Accordion title="API Endpoints Reference" icon={FileCode}>
							<div className="space-y-4 text-sm text-surface-700 dark:text-surface-300">
								<p>All available API endpoints grouped by feature.</p>

								{/* Auth */}
								<div>
									<h4 className="font-bold text-surface-900 dark:text-white mb-2 flex items-center gap-2">
										<Shield size={14} className="text-primary-500" />
										Authentication
									</h4>
									<div className="space-y-1.5">
										{[
											{ method: "POST", path: "/api/auth/signup", desc: "Register a new user" },
											{ method: "POST", path: "/api/auth/login", desc: "Login with email & password" },
											{ method: "POST", path: "/api/auth/logout", desc: "Clear auth cookie" },
											{ method: "POST", path: "/api/auth/verify-email", desc: "Verify email with 6-digit code" },
											{ method: "POST", path: "/api/auth/forgot-password", desc: "Send password reset email" },
											{ method: "POST", path: "/api/auth/reset-password/:token", desc: "Reset password with token" },
											{ method: "GET", path: "/api/auth/google", desc: "Redirect to Google OAuth" },
											{ method: "GET", path: "/api/auth/check-auth", desc: "Check current auth status" },
										].map((ep) => (
											<div key={ep.path + ep.method} className="flex items-center gap-3 py-1.5 px-3 rounded bg-surface-50 dark:bg-surface-900">
												<span className={`text-xs font-bold w-12 ${ep.method === "GET" ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}`}>
													{ep.method}
												</span>
												<code className="text-xs font-mono text-surface-700 dark:text-surface-300 flex-1">{ep.path}</code>
												<span className="text-xs text-surface-500 dark:text-surface-400 hidden sm:block">{ep.desc}</span>
											</div>
										))}
									</div>
								</div>

								{/* User */}
								<div>
									<h4 className="font-bold text-surface-900 dark:text-white mb-2 flex items-center gap-2">
										<Users size={14} className="text-primary-500" />
										User Profile
									</h4>
									<div className="space-y-1.5">
										{[
											{ method: "GET", path: "/api/user/profile", desc: "Get current user profile" },
											{ method: "PUT", path: "/api/user/profile", desc: "Update name" },
											{ method: "PUT", path: "/api/user/change-password", desc: "Change password" },
											{ method: "DELETE", path: "/api/user/delete-account", desc: "Delete account" },
										].map((ep) => (
											<div key={ep.path + ep.method} className="flex items-center gap-3 py-1.5 px-3 rounded bg-surface-50 dark:bg-surface-900">
												<span className={`text-xs font-bold w-12 ${ep.method === "GET" ? "text-green-600 dark:text-green-400" : ep.method === "DELETE" ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}`}>
													{ep.method}
												</span>
												<code className="text-xs font-mono text-surface-700 dark:text-surface-300 flex-1">{ep.path}</code>
												<span className="text-xs text-surface-500 dark:text-surface-400 hidden sm:block">{ep.desc}</span>
											</div>
										))}
									</div>
								</div>

								{/* Admin */}
								<div>
									<h4 className="font-bold text-surface-900 dark:text-white mb-2 flex items-center gap-2">
										<Shield size={14} className="text-red-500" />
										Admin (requires admin role)
									</h4>
									<div className="space-y-1.5">
										{[
											{ method: "GET", path: "/api/admin/stats", desc: "Dashboard statistics" },
											{ method: "GET", path: "/api/admin/users", desc: "List all users (paginated)" },
											{ method: "PUT", path: "/api/admin/users/:id/role", desc: "Update user role" },
											{ method: "DELETE", path: "/api/admin/users/:id", desc: "Delete a user" },
										].map((ep) => (
											<div key={ep.path + ep.method} className="flex items-center gap-3 py-1.5 px-3 rounded bg-surface-50 dark:bg-surface-900">
												<span className={`text-xs font-bold w-12 ${ep.method === "GET" ? "text-green-600 dark:text-green-400" : ep.method === "DELETE" ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}`}>
													{ep.method}
												</span>
												<code className="text-xs font-mono text-surface-700 dark:text-surface-300 flex-1">{ep.path}</code>
												<span className="text-xs text-surface-500 dark:text-surface-400 hidden sm:block">{ep.desc}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</Accordion>
					</div>

					{/* Bottom CTA */}
					<div className="mt-10 card p-6 text-center">
						<h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">Need help?</h3>
						<p className="text-sm text-surface-600 dark:text-surface-400">
							If you run into issues, check the README.md file or reach out for support. Happy building!
						</p>
					</div>
				</motion.div>
			</main>

			<Footer />
		</div>
	);
};

export default SetupGuidePage;
