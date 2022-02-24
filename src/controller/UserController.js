const User = require("../models/User")
const cloudinary = require("../cloudinary")

class SignUpController {
    signup(req, res, next) {
        res.render("signup")
    }

    signup_submit(req, res, next) {
        var data = req.body
        var errs = []
        var user = new User(data)

        if (req.body.name == "") errs.push("vui lòng nhập tên")
        if (req.body.email == "") errs.push("vui lòng nhập email")
        if (req.body.password == "") errs.push("vui lòng nhập mật khẩu")

        if (req.file === undefined) errs.push("vui lòng chọn ảnh")

        User.findOne({ email: data.email })
            .then(usercheck => {
                if (usercheck)
                    errs.push("email đã tồn tại")

                if (errs.length !== 0) {
                    res.render("signup", {
                        errs: errs,
                        value: data,
                    })
                    return
                }
                else {


                    cloudinary.uploader.upload(req.file.path)
                        .then(result => {
                            user.avatar = result.secure_url
                            user.save()
                                .then(() => res.redirect("/user/login"))
                                .catch(err => next(err))

                        })
                        .catch(err => console.log(err))

                }
            })
            .catch(err => next(err))
    }
    login(req, res, next) {
        res.render("login")
    }

    login_submit(req, res, next) {
        var data = req.body
        var email = data.email
        var password = data.password
        var errs = []
        if (!email) {
            errs.push("vui lòng nhập email")
            return res.render("login", {
                email: email,
                password: password,
                errs: errs
            })
        }
        if (!password) {
            errs.push("vui lòng nhập mật khẩu")
            return res.render("login", {
                email: email,
                password: password,
                errs: errs
            })
        }
        User.findOne({ email: data.email })
            .then(user => {
                if (!user) {
                    errs.push("email này không tồn tại")
                    return res.render("login", {
                        email: email,
                        password: password,
                        errs: errs
                    })
                }

                if (password !== user.password) errs.push("bạn nhập sai mật khẩu")
                else {
                    res.cookie("user_id", user._id)
                    res.redirect("/home")
                    return
                }
                if (errs.length !== 0) {
                    return res.render("login", {
                        email: email,
                        password: password,
                        errs: errs
                    })
                }
            })
            .catch(err => next(err))
    }
    change_password(req, res, next) {
        res.render("changepassword")
    }
    change_password_submit(req, res, next) {
        var oldpass = req.body.oldpass
        var pass1 = req.body.pass1
        var pass2 = req.body.pass2
        var errs = []
        User.findById(req.cookies.user_id)
            .then((user) => {
                if (pass1 !== pass2) errs.push("Bạn nhập mật khẩu mới không khớp")
                if (oldpass !== user.password) errs.push("Mật khẩu cũ không khớp")
                if (errs.length != 0) {
                    return res.render("changepassword", {
                        errs: errs
                    })
                }
                user.password = pass1
                user.save()
                res.redirect("/home")

            })
            .catch(err => next(err))
    }
}
module.exports = new SignUpController