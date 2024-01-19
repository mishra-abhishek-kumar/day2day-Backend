const router = require("express").Router();
const expenseControllet = require("../controllers/expenseController");
const requiredUser = require("../middlewares/requiredUser");

router.post("/add-expense", requiredUser, expenseControllet.addExpense);
router.get("/get-expense", requiredUser, expenseControllet.getExpense);
router.delete("/delete-expense/:expenseId", requiredUser, expenseControllet.deleteExpense);

module.exports = router;
