import mongoose from "mongoose";

export const connectDB = async () => {
	const dbType = process.env.DB_TYPE || "mongodb";

	if (dbType === "postgres") {
		const { connectPostgres } = await import("./postgres.js");
		await connectPostgres();
	} else {
		try {
			const conn = await mongoose.connect(process.env.MONGO_URI);
			console.log(`MongoDB Connected: ${conn.connection.host}`);
		} catch (error) {
			console.error("Error connecting to MongoDB:", error.message);
			process.exit(1);
		}
	}
};
