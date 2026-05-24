export const validate = (schema) => (req, res, next) => {
	try {
		schema.parse(req.body);
		next();
	} catch (error) {
		const errors = error.errors.map((err) => ({
			field: err.path.join("."),
			message: err.message,
		}));
		return res.status(400).json({ success: false, message: errors[0].message, errors });
	}
};
