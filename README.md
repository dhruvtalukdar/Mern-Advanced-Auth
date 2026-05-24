<h1 align="center">AuthKit Pro</h1>
<p align="center">Production-ready authentication boilerplate with Google OAuth, role-based access control, and a modern UI.<br/>Supports both <strong>MongoDB</strong> and <strong>PostgreSQL</strong> — switch with a single env variable.</p>

---

## Features

- **Email & Password Auth** — signup, login, email verification, password reset
- **Google OAuth** — one-click sign-in with automatic account linking
- **Role-Based Access** — admin and user roles with protected routes
- **Admin Panel** — user management, stats dashboard, role assignment
- **Profile Management** — update name, change password, delete account
- **Dark/Light Mode** — theme toggle with system preference detection
- **Dual Database Support** — MongoDB or PostgreSQL, switchable via `DB_TYPE` env var
- **Rate Limiting** — brute-force protection on auth endpoints
- **Input Validation** — Zod schemas on all backend endpoints
- **Responsive UI** — clean minimal SaaS design built with Tailwind CSS

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Tailwind CSS, Framer Motion, Zustand, React Router |
| Backend | Node.js, Express, Passport.js |
| Database | MongoDB (Mongoose) **or** PostgreSQL (Sequelize) |
| Email | Mailtrap |
| Auth | JWT (HTTP-only cookies), Google OAuth 2.0, bcrypt |

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd authkit-pro
npm install
npm install --prefix frontend
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Key variables:

| Variable | Description |
|----------|-------------|
| `DB_TYPE` | `mongodb` or `postgres` |
| `MONGO_URI` | MongoDB connection string (if using MongoDB) |
| `POSTGRES_URI` | PostgreSQL connection string (if using PostgreSQL) |
| `JWT_SECRET` | Random secret for JWT signing |
| `MAILTRAP_TOKEN` | Mailtrap API token |
| `CLIENT_URL` | Frontend URL (default: `http://localhost:5173`) |

### 3. Run Development

```bash
# Backend (from root)
npm run dev

# Frontend (separate terminal)
cd frontend
npm run dev
```

### 4. Production Build

```bash
npm run build
npm start
```

---

## Database Setup

### Option A: MongoDB (default)

Set `DB_TYPE=mongodb` in your `.env`:

```bash
DB_TYPE=mongodb
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/authkit_pro
```

Works with MongoDB Atlas (free tier) or a local MongoDB instance.

### Option B: PostgreSQL

Set `DB_TYPE=postgres` in your `.env`:

```bash
DB_TYPE=postgres
POSTGRES_URI=postgresql://user:password@localhost:5432/authkit_pro
POSTGRES_SSL=false
```

The schema is auto-created via Sequelize sync on first startup. For production, set `POSTGRES_SSL=true` if your host requires it (e.g., Supabase, Neon, Railway).

**Local PostgreSQL quickstart:**

```bash
# Create the database
createdb authkit_pro

# Set your connection string
POSTGRES_URI=postgresql://postgres:password@localhost:5432/authkit_pro
```

**Cloud PostgreSQL options:** Supabase, Neon, Railway, Render, or any PostgreSQL host.

---

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → **APIs & Services** → **Credentials**
3. Create OAuth 2.0 Client ID (Web application)
4. Set Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
5. Copy Client ID and Secret to `.env`

If you skip this, sign-up/login still works with email and password.

---

## Email Setup

### Testing Mode (default)

Emails are captured in your Mailtrap inbox — no domain required.

- Sign up at [mailtrap.io](https://mailtrap.io)
- Get your API token and Inbox ID from **Email Testing → Inboxes**
- Emails appear in the Mailtrap dashboard, never reach real users

### Production Mode

To send real emails:

1. Verify a domain in Mailtrap → **Email Sending → Sending Domains**
2. In `backend/mailtrap/mailtrap.config.js`, remove `testInboxId` and update the sender email
3. In `backend/mailtrap/emails.js`, change `mailtrapClient.testing.send()` → `mailtrapClient.send()`

---

## Project Structure

```
├── backend/
│   ├── config/          # Passport OAuth config
│   ├── controllers/     # Auth, User, Admin controllers
│   ├── db/              # MongoDB & PostgreSQL connectors
│   ├── mailtrap/        # Email templates & sending
│   ├── middleware/       # Auth, rate limiting, validation, roles
│   ├── models/          # Mongoose & Sequelize schemas
│   ├── repositories/    # Database abstraction layer
│   ├── routes/          # API routes
│   ├── utils/           # JWT token generation
│   └── validators/      # Zod validation schemas
├── frontend/
│   └── src/
│       ├── components/  # Navbar, Footer, AuthLayout, etc.
│       ├── context/     # Theme context
│       ├── pages/       # All app pages
│       └── store/       # Zustand auth store
├── .env.example         # Template for environment variables
└── .env                 # Your local config (git-ignored)
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | — |
| POST | `/api/auth/login` | Login | — |
| POST | `/api/auth/logout` | Logout | — |
| POST | `/api/auth/verify-email` | Verify email code | — |
| POST | `/api/auth/forgot-password` | Request reset link | — |
| POST | `/api/auth/reset-password/:token` | Reset password | — |
| GET | `/api/auth/google` | Google OAuth redirect | — |
| GET | `/api/auth/check-auth` | Check auth status | JWT |
| GET | `/api/user/profile` | Get profile | JWT |
| PUT | `/api/user/profile` | Update profile | JWT |
| PUT | `/api/user/change-password` | Change password | JWT |
| DELETE | `/api/user/delete-account` | Delete account | JWT |
| GET | `/api/admin/stats` | Dashboard stats | Admin |
| GET | `/api/admin/users` | List all users | Admin |
| PUT | `/api/admin/users/:id/role` | Update user role | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |

---

## Switching Databases

The app uses a **repository pattern** — all database operations go through `backend/repositories/user.repository.js`. This means:

- You can switch between MongoDB and PostgreSQL by changing **one env variable** (`DB_TYPE`)
- No controller or middleware code changes needed
- Both databases use the same API and behavior

To switch: stop the server, change `DB_TYPE` in `.env`, and restart.

---

## License

MIT
