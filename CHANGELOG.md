# Changelog

All notable changes to AuthKit Pro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-05-26

### Added
- **Resend email provider** — Choose between Mailtrap and Resend via `EMAIL_PROVIDER` env var
- **Resend verification endpoint** — `POST /api/auth/resend-verification` to request a new code
- **Refresh token rotation** — Short-lived access tokens + long-lived refresh tokens with logout-all-devices support
- **TOTP Two-Factor Authentication** — Google Authenticator / Authy support with QR code setup
- **Docker Compose** — One-command local development with MongoDB or PostgreSQL
- **Helmet security headers** — X-Frame-Options, HSTS, and other security headers out of the box
- **Configurable branding** — `APP_NAME` env var for email sender name and templates

### Changed
- Verification codes now use `crypto.randomInt()` for cryptographic security
- `forgotPassword` no longer reveals whether an email exists (prevents enumeration)
- `verifyToken` middleware returns proper 401 status for expired/invalid tokens (was 500)
- Email templates now correctly state "24 hours" expiry (was incorrectly "15 minutes")
- Default PORT normalized to 5000 across backend and frontend

### Fixed
- Google OAuth now works correctly with PostgreSQL (was using MongoDB-specific `_id`)

## [1.0.0] - 2026-05-01

### Added
- **Dual database support** — MongoDB and PostgreSQL with repository pattern abstraction
- **JWT authentication** — Secure cookie-based sessions with httpOnly cookies
- **Google OAuth 2.0** — One-click sign-in with Google
- **Email verification** — 6-digit code sent on signup
- **Password reset flow** — Secure token-based password recovery
- **Role-based access control** — Admin and user roles with middleware guards
- **Rate limiting** — Tiered rate limits for auth, API, and password reset endpoints
- **Zod validation** — Request validation with detailed error messages
- **Admin dashboard** — User management, role updates, and statistics
- **User profile management** — Update name, change password, delete account
- **Dark mode** — System-aware theme with manual toggle
- **Responsive design** — Mobile-first UI with Tailwind CSS
- **Production build** — Single server deployment (backend serves frontend)
