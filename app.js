const express = require("express");
const app = express();

//import required to create environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

//import required to parse JSON data from a POST request
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//import required to set additional headers to the response using helmet
const helmet = require("helmet");
app.use(helmet());

//import required to compress the files on page load
const compression = require("compression");
app.use(compression()); //It does not compress img or mp4, only html, css, js files

const fs = require("fs");
const path = require("path");
const accessLogStream = fs.createWriteStream(
	path.join(__dirname, "access.log"),
	{ flags: "a" }
);

//import required to print logs
const morgan = require("morgan");
app.use(morgan("combined", { stream: accessLogStream }));

//import required for main-routing
const mainRoute = require("./routes/index");

//imports required for DB connection and table creation
const sequelize = require("./util/dbConnect");
const User = require("./models/Users");
const Expense = require("./models/Expenses");
const Order = require("./models/Orders");
const ForgotPassword = require("./models/ForgotPasswordRequests");
const Download = require("./models/Downloads");

//import required to allow CORS origin connection
const cors = require("cors");
app.use(cors());

app.use("/", mainRoute);

app.get("/:temp", (req, res) => {
	res.status(400).send("Not Found");
});

const PORT = process.env.PORT || 4001;

User.hasMany(Expense); //It will create a foreignKey to Comment table
Expense.belongsTo(User, { constraints: true }); //this constraints specifies that Post table should be created before Comment table

User.hasMany(Order);
Order.belongsTo(User, { constraints: true });

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User, { constraints: true });

User.hasMany(Download);
Download.belongsTo(User, { constraints: true});

// sequelize.sync({ force: true })
sequelize.sync()
	.then((user) => {
		app.listen(PORT, () => {
			console.log("Listening on PORT:", PORT);
		});
	})
	.catch((err) => console.log(err));
