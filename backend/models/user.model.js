import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: function () {
				return !this.googleId;
			},
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		avatar: {
			type: String,
			default: "",
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		googleId: {
			type: String,
			unique: true,
			sparse: true,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		theme: {
			type: String,
			enum: ["light", "dark", "system"],
			default: "system",
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
