const router = require("express").Router();
const passwordController = require("../controllers/passwordController");

router.post("/user-exist", passwordController.userExist);
router.post("/forgot-password", passwordController.forgotPassword);
router.get("/get-user/:uuid", passwordController.getUser);
router.post("/update-password", passwordController.updateUserPassword);

module.exports = router;
