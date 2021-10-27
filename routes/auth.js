const express = require('express');
const router = express.Router();

const {register,login,forgotpassword,resetpassword} = require("../controllers/auth");
const {register2,login2,forgotpassword2,resetpassword2} = require("../controllers/auth2");

router.post("/register",register);
router.post("/login",login);
router.post("/forgotpassword",forgotpassword);
router.put("/resetpassword/:resetToken",resetpassword);

router.post("/student/register",register2);
router.post("/student/login",login2);
router.post("/student/forgotpassword",forgotpassword2);
router.put("/student/resetpassword/:resetToken",resetpassword2);

module.exports = router;