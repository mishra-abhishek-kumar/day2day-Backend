const Sequelize = require("sequelize");
const sequelize = require("../util/dbConnect");

const Order = sequelize.define("orders", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	paymentId: {
		type: Sequelize.STRING,
	},
	orderId: {
		type: Sequelize.STRING,
	},
	status: {
		type: Sequelize.STRING,
	},
});

module.exports = Order;
