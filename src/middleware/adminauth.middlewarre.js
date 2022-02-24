const Admin = require("../models/Admin")
const Course = require("../models/Course")

module.exports = function(req,res,next){
    if(!req.cookies.admin_id){
        res.redirect("/admins/login")
        return
    }
    var query= Admin.findOne({_id:req.cookies.admin_id}).lean().populate("courses")
    query.exec()
    .then((admin) => {
        res.locals.admin = admin
        res.locals.mycourses = admin.courses
        Course.find({}).lean()
        .then((courses) =>{
            res.locals.courses = courses
            next()
        })
    })
    .catch( err => next(err)) 
}