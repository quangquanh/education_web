var Course = require("../models/Course")
const Type = require("../models/Type")
const User = require("../models/User")
class SiteController {
    home(req, res, next) {
        Course.find({}).lean()
            .then(Courses => res.render("home", {
                courses: Courses
            }))
            .catch(err => next(err))
    }
    type(req, res, next) {
        Type.findOne({ slug: req.params.slug }).lean().populate("courses").exec()
            .then((type) => {
                var courses = type.courses
                res.render("home", {
                    courses: courses
                })
            })
            .catch(err=>next(err))
    }
    add(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then((course) => {
                User.findOne({ _id: res.locals.user._id }).populate("courses").exec()
                    .then(user => {
                        if (user.courses.some((ele)=>ele.name === course.name)) {
                            return res.redirect("back")
                        }
                        else {
                            user.courses.push(course)
                            user.save()
                            return res.redirect("back")
                        }
                    })
                    .catch(err => next(err))
            })
            .catch(err => next(err))
    }
    search(req, res) {
        var search = req.query.search
        Course.find({ name: { $regex: search } }).lean()
            .then(courses => res.render("home", {
                layout: "main",
                courses: courses,
            }))
            .catch(err=>next(err))
    }
}
module.exports = new SiteController