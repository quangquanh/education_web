const express = require("express");
const router = express.Router()
const multer = require("multer")
const UserController = require("../controller/UserController")
var upload = multer({ storage:multer.diskStorage({}) })

router.get("/signup",(req,res,next)=>{
    if(req.cookies.user_id){
        return  res.redirect("/home")
    }
    else next()
}, UserController.signup)
router.post("/signup", upload.single("avatar"), UserController.signup_submit)


router.get("/login",(req,res,next)=>{
    if(req.cookies.user_id){
        return  res.redirect("/home")
    }
    else next()
}, UserController.login)
router.post("/login", UserController.login_submit)

router.get("/logout", (req, res) => {
    res.clearCookie("user_id")
    res.redirect("/user/login")
})

router.get("/changepassword",UserController.change_password)
router.post("/changepassword",UserController.change_password_submit)

module.exports = router