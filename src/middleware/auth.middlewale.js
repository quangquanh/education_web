const Type = require("../models/Type")
const User = require("../models/User")

module.exports = function (req, res, next) {
    if (!req.cookies.user_id) {
        res.redirect("/user/login")
        return
    }
    Type.find({}).lean().then(type => res.locals.type = type)
    User.findOne({ _id: req.cookies.user_id }).lean().populate("courses").exec()
        .then((user) => {
            if (!user) {
                res.redirect("/user/login")
                return
            }
            res.locals.mycourse = user.courses
            res.locals.user = user
            next()
        })

}