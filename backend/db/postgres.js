import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Lazily created — only instantiated when connectPostgres() is called
let sequelize = null;

export const getSequelize = () => {
	if (!sequelize) {
		sequelize = new Sequelize(process.env.POSTGRES_URI, {
			dialect: "postgres",
			logging: process.env.NODE_ENV === "development" ? console.log : false,
			dialectOptions: {
				ssl: process.env.POSTGRES_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
			},
		});
	}
	return sequelize;
};

export const connectPostgres = async () => {
	try {
		const db = getSequelize();
		await db.authenticate();
		console.log(`PostgreSQL Connected: ${db.config.host || "localhost"}`);

		// Import models here so they register themselves against the sequelize instance
		await import("../models/user.postgres.js");

		// Sync models (creates tables if they don't exist)
		await db.sync({ alter: process.env.NODE_ENV === "development" });
		console.log("PostgreSQL tables synced");
	} catch (error) {
		console.error("Error connecting to PostgreSQL:", error.message);
		process.exit(1);
	}
};
