import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(process.env.POSTGRES_URI, {
	dialect: "postgres",
	logging: process.env.NODE_ENV === "development" ? console.log : false,
	dialectOptions: {
		ssl: process.env.POSTGRES_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
	},
});

export const connectPostgres = async () => {
	try {
		await sequelize.authenticate();
		console.log(`PostgreSQL Connected: ${sequelize.config.host || "localhost"}`);

		// Sync models (creates tables if they don't exist)
		await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
		console.log("PostgreSQL tables synced");
	} catch (error) {
		console.error("Error connecting to PostgreSQL:", error.message);
		process.exit(1);
	}
};
