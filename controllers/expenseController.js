const Expense = require("../models/Expenses");
const User = require("../models/Users");
const sequelize = require("../util/dbConnect");

const addExpense = async (req, res) => {
	const txn = await sequelize.transaction();

	const { amt, description, category } = req.body;
	try {
		const user = await User.findByPk(req.id);

		const totalAmt = user.totalExpense + parseInt(req.body.amt);

		await User.update(
			{ totalExpense: totalAmt },
			{ where: { id: req.id } },
			{ transaction: txn }
		);

		const expense = await Expense.create(
			{
				amt: amt,
				description: description,
				category: category,
				userId: req.id,
			},
			{ transaction: txn }
		);

		await txn.commit();

		res.send(expense);
	} catch (error) {
		if (txn) {
			await txn.rollback();
		}
		console.log(error);
	}
};

// const getExpense = async (req, res) => {
//     // let page = 1;
//     const expensePerPage = 5;
// 	try {
//         const skip = (req.params.page - 1) * expensePerPage;
//         // const skip = 0;
// 		const expenses = await Expense.findAll({limit: expensePerPage, offset: skip, where: { userId: req.id } });
// 		res.send(expenses);
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

const getExpense = async (req, res) => {
	try {
		const expenses = await Expense.findAll({ where: { userId: req.id } });
		res.send(expenses);
	} catch (error) {
		console.log(error);
	}
};

const deleteExpense = async (req, res) => {
	const txn = await sequelize.transaction();

	const expenseId = req.params.expenseId;
	try {
		//finding exact expense from expense table
		const expense = await Expense.findByPk(expenseId);
		//finding the user with that expense
		const user = await User.findByPk(expense.userId);

		const totalAmt = Number(user.totalExpense) - Number(expense.amt);

		await User.update(
			{ totalExpense: totalAmt },
			{ where: { id: req.id } },
			{ transaction: txn }
		);

		const result = await expense.destroy();

		await txn.commit();

		res.status(200).json({ result: result });
	} catch (error) {
		if (txn) {
			await txn.rollback();
		}
		console.log(error);
	}
};

module.exports = {
	addExpense,
	getExpense,
	deleteExpense,
};
