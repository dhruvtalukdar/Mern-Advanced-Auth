import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

export const mailtrapClient = new MailtrapClient({
	token: process.env.MAILTRAP_TOKEN,
	testInboxId: parseInt(process.env.MAILTRAP_INBOX_ID),
});

export const sender = {
	email: "mailtrap@demomailtrap.com",
	name: "Burak",
};
