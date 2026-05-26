import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { resendClient, resendSender } from "./resend.config.js";

const APP_NAME = process.env.APP_NAME || "AuthKit Pro";

const injectAppName = (html) => html.replaceAll("{appName}", APP_NAME);

export const sendVerificationEmail = async (email, verificationToken) => {
	try {
		const { data, error } = await resendClient.emails.send({
			from: resendSender,
			to: email,
			subject: "Verify your email",
			html: injectAppName(VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)),
		});

		if (error) throw new Error(error.message);
		console.log("Verification email sent successfully", data);
	} catch (error) {
		console.error("Error sending verification email", error);
		throw new Error(`Error sending verification email: ${error}`);
	}
};

export const sendWelcomeEmail = async (email, name) => {
	try {
		const { data, error } = await resendClient.emails.send({
			from: resendSender,
			to: email,
			subject: `Welcome to ${APP_NAME}!`,
			html: `<h1>Welcome, ${name}!</h1><p>Your email has been verified successfully. Welcome to ${APP_NAME}!</p>`,
		});

		if (error) throw new Error(error.message);
		console.log("Welcome email sent successfully", data);
	} catch (error) {
		console.error("Error sending welcome email", error);
		throw new Error(`Error sending welcome email: ${error}`);
	}
};

export const sendPasswordResetEmail = async (email, resetURL) => {
	try {
		const { error } = await resendClient.emails.send({
			from: resendSender,
			to: email,
			subject: "Reset your password",
			html: injectAppName(PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL)),
		});

		if (error) throw new Error(error.message);
	} catch (error) {
		console.error("Error sending password reset email", error);
		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccessEmail = async (email) => {
	try {
		const { data, error } = await resendClient.emails.send({
			from: resendSender,
			to: email,
			subject: "Password Reset Successful",
			html: injectAppName(PASSWORD_RESET_SUCCESS_TEMPLATE),
		});

		if (error) throw new Error(error.message);
		console.log("Password reset success email sent successfully", data);
	} catch (error) {
		console.error("Error sending password reset success email", error);
		throw new Error(`Error sending password reset success email: ${error}`);
	}
};
