const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUpController = async (req, res) => {
	try {
		//spreading user information from request body
		const { name, email, password } = req.body;

		//checking if any field is empty
		if (!name || !email || !password) {
			return res.status(400).send("All fields are required");
		}

		//checking if the user already registered
		const oldUser = await User.findAll({ where: { email: email } }); //this returns an array
		if (oldUser.length > 0) {
			return res.status(409).send("User is already registered");
		}

		//hashing the password using bcrypt
		const hashedPassword = await bcrypt.hash(password, 10);

		//creating new user
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			isPremium: false,
		});

		//generating accessToken
		const accessToken = generateAccessToken({ id: user.id });

		return res.status(201).json(accessToken);
	} catch (error) {
		return res.status(500).send(error);
	}
};

const loginController = async (req, res) => {
	try {
		//spreading user information from request body
		const { email, password } = req.body;

		//checking if any field is empty
		if (!email || !password) {
			return res.status(400).send("Enter all the fields");
		}

		//cheking if user exists
		const user = await User.findAll({ where: { email: email } });
		if (user.length == 0) {
			return res.status(409).send("User is not registered");
		}

		//checking entered password is correct or not
		const matchedPassword = await bcrypt.compare(password, user[0].password);
		if (!matchedPassword) {
			return res.status(403).send("Incorrect password");
		}

		//generating accessToken
		const accessToken = generateAccessToken({ id: user[0].id });

		//sending user on successful login
		return res.status(200).json(accessToken);
	} catch (error) {
		return res.status(500).send(error);
	}
};

const isPremium = async (req, res) => {
	try {
		const isPremium = await User.findByPk(req.id);
		return res.status(200).json(isPremium);
	} catch (error) {
		console.log(error);
	}
};

const generateAccessToken = (id) => {
	try {
		const accessToken = jwt.sign(id, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
			expiresIn: "1d",
		});
		console.log(accessToken);
		return accessToken;
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	signUpController,
	loginController,
	isPremium,
};
