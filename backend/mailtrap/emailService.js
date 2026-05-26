/**
 * emailService.js — provider dispatcher
 *
 * Set EMAIL_PROVIDER in your .env:
 *   EMAIL_PROVIDER=mailtrap   → uses mailtrap/emails.js  (default)
 *   EMAIL_PROVIDER=resend     → uses mailtrap/resend.emails.js
 *
 * All consumers import from this file — the individual provider files
 * are never modified.
 */

const provider = process.env.EMAIL_PROVIDER || "mailtrap";

let emailModule;

if (provider === "resend") {
	emailModule = await import("./resend.emails.js");
} else {
	emailModule = await import("./emails.js");
}

export const sendVerificationEmail = emailModule.sendVerificationEmail;
export const sendWelcomeEmail = emailModule.sendWelcomeEmail;
export const sendPasswordResetEmail = emailModule.sendPasswordResetEmail;
export const sendResetSuccessEmail = emailModule.sendResetSuccessEmail;
