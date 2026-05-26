import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

export const resendClient = new Resend(process.env.RESEND_API_KEY);

// Use a verified sender domain in production.
// On the free tier you can only send FROM onboarding@resend.dev
// and only TO your own verified email address.
export const resendSender = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
