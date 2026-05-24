import { DataTypes } from "sequelize";
import { sequelize } from "../db/postgres.js";

const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: { isEmail: true },
			set(value) {
				this.setDataValue("email", value.toLowerCase().trim());
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		avatar: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		role: {
			type: DataTypes.ENUM("user", "admin"),
			defaultValue: "user",
		},
		googleId: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: true,
		},
		lastLogin: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		isVerified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		theme: {
			type: DataTypes.ENUM("light", "dark", "system"),
			defaultValue: "system",
		},
		resetPasswordToken: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		resetPasswordExpiresAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		verificationToken: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		verificationTokenExpiresAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		tableName: "users",
		timestamps: true,
	}
);

export default User;
