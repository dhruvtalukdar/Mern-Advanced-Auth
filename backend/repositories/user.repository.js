import dotenv from "dotenv";
dotenv.config();

const dbType = process.env.DB_TYPE || "mongodb";

let UserRepository;

if (dbType === "postgres") {
	const { default: PgUser } = await import("../models/user.postgres.js");

	UserRepository = {
		async findById(id, excludeFields = []) {
			const attributes = excludeFields.length > 0 ? { exclude: excludeFields } : undefined;
			const user = await PgUser.findByPk(id, { attributes });
			return user ? user.toJSON() : null;
		},

		async findOne(query) {
			const where = {};
			for (const [key, value] of Object.entries(query)) {
				if (typeof value === "object" && value.$gt) {
					const { Op } = await import("sequelize");
					where[key] = { [Op.gt]: new Date(value.$gt) };
				} else {
					where[key] = value;
				}
			}
			const user = await PgUser.findOne({ where });
			return user;
		},

		async create(data) {
			const user = await PgUser.create(data);
			return user;
		},

		async save(user) {
			if (user.save) {
				await user.save();
				return user;
			}
			// If it's a plain object from toJSON(), find and update
			const existing = await PgUser.findByPk(user.id);
			if (existing) {
				Object.assign(existing, user);
				await existing.save();
				return existing;
			}
			return user;
		},

		async findByIdAndUpdate(id, data, options = {}) {
			const user = await PgUser.findByPk(id);
			if (!user) return null;
			Object.assign(user, data);
			await user.save();
			return options.new !== false ? user : null;
		},

		async findByIdAndDelete(id) {
			const user = await PgUser.findByPk(id);
			if (!user) return null;
			await user.destroy();
			return user;
		},

		async findAll({ where = {}, order = [["createdAt", "DESC"]], offset = 0, limit = 20, exclude = [] } = {}) {
			const queryWhere = {};
			for (const [key, value] of Object.entries(where)) {
				if (typeof value === "object" && value.$gte) {
					const { Op } = await import("sequelize");
					queryWhere[key] = { [Op.gte]: new Date(value.$gte) };
				} else {
					queryWhere[key] = value;
				}
			}
			const attributes = exclude.length > 0 ? { exclude } : undefined;
			const users = await PgUser.findAll({ where: queryWhere, order, offset, limit, attributes });
			return users.map((u) => u.toJSON());
		},

		async countDocuments(where = {}) {
			const queryWhere = {};
			for (const [key, value] of Object.entries(where)) {
				if (typeof value === "object" && value.$gte) {
					const { Op } = await import("sequelize");
					queryWhere[key] = { [Op.gte]: new Date(value.$gte) };
				} else {
					queryWhere[key] = value;
				}
			}
			return await PgUser.count({ where: queryWhere });
		},

		getId(user) {
			return user.id;
		},

		toSafeObject(user, excludeFields = ["password"]) {
			const obj = user.toJSON ? user.toJSON() : { ...user };
			excludeFields.forEach((f) => delete obj[f]);
			return obj;
		},
	};
} else {
	// MongoDB (default)
	const { User: MongoUser } = await import("../models/user.model.js");

	UserRepository = {
		async findById(id, excludeFields = []) {
			const selectStr = excludeFields.map((f) => `-${f}`).join(" ");
			return await MongoUser.findById(id).select(selectStr || undefined);
		},

		async findOne(query) {
			return await MongoUser.findOne(query);
		},

		async create(data) {
			const user = new MongoUser(data);
			await user.save();
			return user;
		},

		async save(user) {
			await user.save();
			return user;
		},

		async findByIdAndUpdate(id, data, options = {}) {
			return await MongoUser.findByIdAndUpdate(id, data, { new: true, ...options });
		},

		async findByIdAndDelete(id) {
			return await MongoUser.findByIdAndDelete(id);
		},

		async findAll({ where = {}, order = [["createdAt", "DESC"]], offset = 0, limit = 20, exclude = [] } = {}) {
			const mongoSort = {};
			order.forEach(([field, dir]) => {
				mongoSort[field] = dir === "DESC" ? -1 : 1;
			});
			const selectStr = exclude.map((f) => `-${f}`).join(" ");
			return await MongoUser.find(where).select(selectStr || undefined).sort(mongoSort).skip(offset).limit(limit);
		},

		async countDocuments(where = {}) {
			return await MongoUser.countDocuments(where);
		},

		getId(user) {
			return user._id;
		},

		toSafeObject(user, excludeFields = ["password"]) {
			const obj = user._doc ? { ...user._doc } : user.toJSON ? user.toJSON() : { ...user };
			excludeFields.forEach((f) => delete obj[f]);
			return obj;
		},
	};
}

export default UserRepository;
