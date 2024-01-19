const jwt = require("jsonwebtoken");
const User = require("../models/Users");

module.exports = async (req, res, next) => {
	const accessToken = req.header("Authorization");

	try {
		const decodedUser = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_PRIVATE_KEY
		);

		req.id = decodedUser.id;

		const user = await User.findByPk(req.id);
		if (!user) {
			return res.status(404).send("User not found");
		}

		next();
	} catch (e) {
		console.log(e);
		return res.status(401).send("Invalid access key");
	}
};
