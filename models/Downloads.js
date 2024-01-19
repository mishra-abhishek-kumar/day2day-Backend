const Sequelize = require("sequelize");
const sequelize = require("../util/dbConnect");

const Download = sequelize.define("downloads", {
    id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
    url: {
        type: Sequelize.STRING,
		allowNull: false,
    },
    downloadDate: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Download;