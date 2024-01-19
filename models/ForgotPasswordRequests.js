const Sequelize = require("sequelize");
const sequelize = require("../util/dbConnect");

const ForgotPassword = sequelize.define("forgot-password", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	uuid: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	isActive: {
		type: Sequelize.BOOLEAN,
	},
});

module.exports = ForgotPassword;
