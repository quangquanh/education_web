const express = require("express")
const router = express.Router()
const multer = require("multer")
var upload = multer({ storage:multer.diskStorage({}) })


var admin_auth_middleware = require("../middleware/adminauth.middlewarre")

const AdminController = require("../controller/AdminController")
const Admin = require("../models/Admin")


router.get("/create",(req,res)=>{
    var admin = new Admin()
    admin.name = "wang"
    admin.password = "Cammich1308"
    admin.save()
    .then(()=>res.json(admin))
})

//render home
router.get("/home", admin_auth_middleware, AdminController.admin_home)

//login
router.get("/login",(req,res,next)=>{
    if(req.cookies.user_id){
        return  res.redirect("/admins/home")
    }
    else next()
}, AdminController.login)
router.post("/login", AdminController.login_submit)
//create tutorial
router.get("/create", admin_auth_middleware, AdminController.create)
router.post("/create", admin_auth_middleware, upload.single("image"), AdminController.create_submit)

// edit tutorial
router.get("/:slug/edit", admin_auth_middleware, AdminController.edit)
router.post("/:slug/edit", upload.single("image"), admin_auth_middleware, AdminController.edit_submit)

// delete tutorial
router.post("/:slug/delete", admin_auth_middleware, AdminController.delete_tutorial)
// search tutorial
router.get("/search", admin_auth_middleware, AdminController.search_tutorial)
// add video
router.get("/:slug/addvideo", admin_auth_middleware, AdminController.addvideo)
router.post("/:slug/addvideo", admin_auth_middleware, AdminController.addvideo_submit)

//view video
router.get("/:slug/video", admin_auth_middleware, AdminController.viewvideo)
//edit video
router.get("/:slug/:id/editvideo", admin_auth_middleware, AdminController.editvideo)
router.post("/:slug/:id/editvideo", admin_auth_middleware, AdminController.editvideo_submit)

router.post("/:slug/:id/deletevideo", admin_auth_middleware, AdminController.delete_video)

// log out
router.get("/logout", (req, res) => {
    res.clearCookie("admin_id")
    res.redirect("/admins/login")
})
module.exports = router