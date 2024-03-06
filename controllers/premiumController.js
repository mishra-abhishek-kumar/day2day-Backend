const RazorPay = require("razorpay");
const Order = require("../models/Orders");
const User = require("../models/Users");
const Expense = require("../models/Expenses");
const Download = require("../models/Downloads");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const AWS = require("aws-sdk");

const purchasePremium = async (req, res) => {
	//Creating new razorpay instance
	const rzpInstance = new RazorPay({
		key_id: process.env.RAZORPAY_KEY_ID,
		key_secret: process.env.RAZORPAY_KEY_SECRET,
	});

	const options = {
		amount: 100,
		currency: "INR",
	};

	try {
		//creating new order using razorpay instance
		const order = await rzpInstance.orders.create(options);
		const newOrder = await Order.create({
			orderId: order.id,
			status: "PENDING",
			userId: req.id,
		});

		res.status(201).json({ order, key_id: rzpInstance.key_id });
	} catch (error) {
		console.log(error);
		res
			.status(403)
			.json({ message: `Something went wrong, can't generate order` });
	}
};

const updateTxnStatus = async (req, res) => {
	const { orderId, paymentId } = req.body;
	const userId = req.id;

	try {
		const order = await Order.findAll({ where: { orderId: orderId } });
		const updatedOrder = await Order.update(
			{ paymentId: paymentId, status: "SUCCESSUL" },
			{ where: { orderId: orderId } }
		);
		const updatedUser = await User.update(
			{ isPremium: true },
			{ where: { id: userId } }
		);

		res.status(200).json({ successful: true });
	} catch (error) {
		console.log(error);
	}
};

const showLeaderboard = async (req, res) => {
	try {
		// Group by both userId and user.id to avoid ambiguity
		const users = await User.findAll({
			attributes: ["name", "totalExpense"],
			order: [["totalExpense", "DESC"]],
		});

		res.status(200).send(users);
	} catch (error) {
		console.log(error);
	}
};

const dailyExpenseReport = async (req, res) => {
	const today = new Date();
	const todayDate = today.toISOString().split("T")[0]; // Get the current date in 'YYYY-MM-DD' format

	try {
		const dailyReport = await Expense.findAll({
			where: {
				createdAt: {
					[Op.between]: [
						todayDate + "T00:00:00.000Z",
						todayDate + "T23:59:59.999Z",
					],
				},
				userId: req.id,
			},
		});

		const stringifiedExpense = JSON.stringify(dailyReport);
		const filename = `DailyExpense${req.id}/${new Date()}.txt`;
		const fileURL = await uploadToS3(stringifiedExpense, filename);

		res.status(200).json({ fileURL, success: true, dailyReport });
	} catch (error) {
		console.log(error);
		res.status(500).json({ fileURL: "", success: false });
	}
};

const monthlyExpenseReport = async (req, res) => {
	try {
		const monthlyReport = await Expense.findAll({
			where: {
				userId: req.id,
				createdAt: {
					[Op.and]: [
						Sequelize.where(
							Sequelize.fn("YEAR", Sequelize.col("createdAt")),
							"=",
							Sequelize.fn("YEAR", Sequelize.fn("CURDATE"))
						),
						Sequelize.where(
							Sequelize.fn("MONTH", Sequelize.col("createdAt")),
							"=",
							Sequelize.fn("MONTH", Sequelize.fn("CURDATE"))
						),
					],
				},
			},
		});

		const stringifiedExpense = JSON.stringify(monthlyReport);
		const filename = `MonthlyExpense${req.id}/${new Date()}.txt`;
		const fileURL = await uploadToS3(stringifiedExpense, filename);

		res.status(200).json({ fileURL, success: true, monthlyReport });
	} catch (error) {
		console.log(error);
		res.status(500).json({ fileURL: "", success: false });
	}
};

const yearlyExpenseReport = async (req, res) => {
	try {
		const yearlyReport = await Expense.findAll({
			where: {
				userId: req.id,
				createdAt: {
					[Op.and]: [
						Sequelize.where(
							Sequelize.fn("YEAR", Sequelize.col("createdAt")),
							"=",
							Sequelize.fn("YEAR", Sequelize.fn("CURDATE"))
						),
					],
				},
			},
		});

		const stringifiedExpense = JSON.stringify(yearlyReport);
		const filename = `YearlyExpense${req.id}/${new Date()}.txt`;
		const fileURL = await uploadToS3(stringifiedExpense, filename);

		res.status(200).json({ fileURL, success: true, yearlyReport });
	} catch (error) {
		console.log(error);
		res.status(500).json({ fileURL: "", success: false });
	}
};

const postReportURL = async (req, res) => {
	const { url, downloadDate } = req.body;
	console.log("doosra padaw");
	try {
		const reportURL = await Download.create({
			url: url,
			downloadDate: downloadDate,
			userId: req.id,
		});
		res.send(reportURL);
	} catch (error) {
		console.log(error);
	}
};

const getReportURL = async (req, res) => {
	try {
		const reportURLs = await Download.findAll({ where: { userId: req.id } });
		res.send(reportURLs);
	} catch (error) {
		console.log(error);
	}
};

function uploadToS3(data, filename) {
	let s3bucket = new AWS.S3({
		accessKeyId: process.env.IAM_USER_KEY,
		secretAccessKey: process.env.IAM_USER_SECRET,
	});

	var params = {
		Bucket: process.env.BUCKET_NAME,
		Key: filename,
		Body: data,
		ACL: "public-read",
	};

	return new Promise((resolve, reject) => {
		s3bucket.upload(params, (err, s3response) => {
			if (err) {
				// console.log("Something went wrong", err);
				reject(err);
			} else {
				// console.log("success", s3response);
				resolve(s3response.Location);
			}
		});
	});
}

module.exports = {
	purchasePremium,
	updateTxnStatus,
	showLeaderboard,
	dailyExpenseReport,
	monthlyExpenseReport,
	yearlyExpenseReport,
	postReportURL,
	getReportURL,
};
