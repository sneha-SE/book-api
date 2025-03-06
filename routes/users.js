var express = require("express");
var router = express.Router();
const { login, signup } = require("../controllers/userControl");
const {adminLogin, adminCanGetAllUsers, adminCanDeleteUsers} = require('../controllers/adminContol');
const authenticateAdmin = require('../middleware/authAdmin')


router.post("/signup", signup);

router.post("/login", login);

router.post('/admin', adminLogin);
router.get("/getall", adminCanGetAllUsers);
router.delete("/delete/:userId", authenticateAdmin, adminCanDeleteUsers);

module.exports = router;
