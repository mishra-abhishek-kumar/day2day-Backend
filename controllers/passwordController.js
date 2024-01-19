const User = require("../models/Users");
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const ForgotPassword = require("../models/ForgotPasswordRequests");
const sequelize = require("../util/dbConnect");
const bcrypt = require("bcrypt");

const userExist = async (req, res) => {
	const emailId = req.body.email;
    
	try {
		const user = await User.findAll({ where: { email: emailId } });
		res.status(200).json({ user: user });
	} catch (error) {
		console.log(error);
	}
};

const forgotPassword = async (req, res) => {
	const emailId = req.body.email;
	const txn = await sequelize.transaction();
	try {
		const userRequested = await User.findAll({ where: { email: emailId } });
		const uuid = uuidv4();
		const forgotPasswordreq = await ForgotPassword.create(
			{
				uuid: uuid,
				isActive: true,
				userId: userRequested[0].id,
			},
			{ transaction: txn }
		);

		const client = Sib.ApiClient.instance;

		//Instantiating the client
		const apiKey = client.authentications["api-key"];

		apiKey.apiKey = process.env.SIB_API_KEY;

		const emailInstance = new Sib.TransactionalEmailsApi();

		const sender = {
			email: "temporary.email1101@gmail.com",
			name: "DAY 2 DAY",
		};

		const receiver = [
			{
				email: emailId,
			},
		];

		const messageId = await emailInstance.sendTransacEmail(
			{
				sender,
				to: receiver,
				subject: `DAY 2 DAY - Reset password link!`,
				params: {
					uuid: uuid,
				},
				htmlContent: `<h2>Click below link to reset your password</h2>
                            <p style="padding-bottom:10px">This link will get expired once you reset the password</p>
                            <a style="color:white; background-color:#00572D; padding:20px; text-align:center;" 
                            href="http://127.0.0.1:5500/FrontEnd/pages/forgotPassword.html?uuid={{params.uuid}}">Reset Password</a>`,
			},
			{ transaction: txn }
		);
		await txn.commit();

		res.status(200).json({ email: messageId });
	} catch (error) {
		console.log(error);
		res.status(401).send(error);
		if (txn) {
			await txn.rollback();
		}
	}
};

const getUser = async (req, res) => {
	// const uuid = req.params.uuid;

	try {
		const passwordReq = await ForgotPassword.findAll({
			where: { uuid: req.params.uuid },
		});
		// console.log(passwordReq.isActive);

		res.send(passwordReq);
	} catch (error) {
		console.log("yaha fat raha hai");
	}
};

const updateUserPassword = async (req, res) => {
	const txn = await sequelize.transaction();
	const { id, password, uuid } = req.body;
	try {
		//hashing the password using bcrypt
		const hashedPassword = await bcrypt.hash(password, 10);

		const updatedUser = await User.update(
			{ password: hashedPassword },
			{ where: { id: id } },
			{ transaction: txn }
		);

		const updateActiveReq = await ForgotPassword.update(
			{ isActive: false },
			{ where: { uuid: uuid } }
		);
        
		await txn.commit();
		res.status(200).json({ updatedUser: updatedUser });
	} catch (error) {
		if (txn) {
			await txn.rollback();
		}
		console.log(error);
	}
};

module.exports = {
	userExist,
	forgotPassword,
	getUser,
	updateUserPassword,
};
