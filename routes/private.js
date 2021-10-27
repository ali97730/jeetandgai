const express = require("express");
const router = express.Router();
const { getPrivateRoute ,submitUserDetails,getUserDetails,updateUserDetails, deleteImage} = require("../controllers/private");
const { protect } = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");



router.get("/",protect, getPrivateRoute);
//for userdetails
router.get("/details/:user_id",protect,getUserDetails)
router.get("/emergency/:user_id",getUserDetails)
router.post("/details/:user_id",upload.array("image",10),protect,submitUserDetails)
router.put("/details/:user_id",upload.array("image",10),protect,updateUserDetails)
router.post("/deleteimage/:user_id",protect,deleteImage)






module.exports = router;