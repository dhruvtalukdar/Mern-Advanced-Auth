<h1 align="center">AuthKit Pro</h1>
<p align="center">Production-ready MERN authentication boilerplate with Google OAuth, role-based access control, and a modern UI.</p>

---

## Features

- **Email & Password Auth** — signup, login, email verification, password reset
- **Google OAuth** — one-click sign-in with automatic account linking
- **Role-Based Access** — admin and user roles with protected routes
- **Admin Panel** — user management, stats dashboard, role assignment
- **Profile Management** — update name, change password, delete account
- **Dark/Light Mode** — theme toggle with system preference detection
- **Rate Limiting** — brute-force protection on auth endpoints
- **Input Validation** — Zod schemas on all backend endpoints
- **Responsive UI** — clean minimal SaaS design built with Tailwind CSS

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Tailwind CSS, Framer Motion, Zustand, React Router |
| Backend | Node.js, Express, Mongoose, Passport.js |
| Database | MongoDB (Atlas or local) |
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

Create a `.env` file in the root:

```bash
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_random_secret_key
NODE_ENV=development

MAILTRAP_TOKEN=your_mailtrap_api_token
MAILTRAP_INBOX_ID=your_mailtrap_inbox_id
MAILTRAP_ENDPOINT=https://send.api.mailtrap.io/

CLIENT_URL=http://localhost:5173

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

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
│   ├── db/              # MongoDB connection
│   ├── mailtrap/        # Email templates & sending
│   ├── middleware/       # Auth, rate limiting, validation, roles
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # JWT token generation
│   └── validators/      # Zod validation schemas
├── frontend/
│   └── src/
│       ├── components/  # Navbar, Footer, AuthLayout, etc.
│       ├── context/     # Theme context
│       ├── pages/       # All app pages
│       └── store/       # Zustand auth store
└── .env
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

## License

MIT
