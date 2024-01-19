const router = require("express").Router();
const userRoute = require("./authRouters");
const expenseRoute = require("./expenseRouters");
const premiumRoute = require("./premiumRouters");
const passwordRoute = require("./passwordRouters");

router.use("/user", userRoute);
router.use("/expenses", expenseRoute);
router.use("/premium", premiumRoute);
router.use("/password", passwordRoute);

module.exports = router;
