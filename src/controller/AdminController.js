const Admin = require("../models/Admin")
const Course = require("../models/Course")
const Type = require("../models/Type")
const Video = require("../models/Video")
const cloudinary = require("../cloudinary")


class AdminController {

    //render home
    admin_home(req, res, next) {
        res.render("admin_home", {
            layout: "main2"
        })
    }

    // login
    login(req, res, next) {
        res.render("adminlogin", {
            layout: "main2"
        })
    }


    login_submit(req, res, next) {
        var errs = []
        var name = req.body.name
        var password = req.body.password
        if (!name) {
            errs.push("bạn chưa nhập tên đăng nhập")
            return res.render("adminlogin", {
                name: name,
                password: password,
                errs: errs,
            })
        }
        if (!password) {
            errs.push("bạn chưa nhập mật khẩu")
            return res.render("adminlogin", {
                name: name,
                password: password,
                errs: errs,
            })
        }
        Admin.findOne({ name: name })
            .then(admin => {
                if (!admin) {
                    errs.push("tên đăng nhập không tồn tại")
                    return res.render("adminlogin", {
                        name: name,
                        password: password,
                        errs: errs,
                    })
                }
                if (password !== admin.password) errs.push("bạn đã nhập sai mật khẩu")

                if (errs.length !== 0) {
                    return res.render("adminlogin", {
                        name: name,
                        password: password,
                        errs: errs,
                    })
                }
                else {
                    res.cookie("admin_id", admin._id)
                    return res.redirect("/admins/home")
                }
            })
            .catch(err => next(err))
    }
    // create tutorials
    create(req, res, next) {
        res.render("create", {
            layout: "main2"
        })
    }
    create_submit(req, res, next) {
        var errs = []
        var course = new Course()
        var admin = res.locals.admin
        course.name = req.body.name
        course.type = req.body.type
        course.description = req.body.description
        if (!req.body.name) errs.push("vui lòng nhập tên khóa học")
        if (!req.body.type) errs.push("vui lòng nhập thể loại")
        if (!req.body.description) errs.push("vui lòng nhập mô tả khóa học")
        if (!req.file) errs.push("vui lòng upload ảnh đại diện")
        if (errs.length != 0) {
            return res.render("create", {
                layout: "main2",
                errs: errs,
                name: req.body.name,
                description: req.body.description
            })
        }

        cloudinary.uploader.upload(req.file.path)
        .then(result => {
            course.image = result.secure_url
            
            course.admin = admin.name
            Type.findOne({ name: req.body.type })
                .then(type => {
                    if (type) {
                        type.courses.push(course)
                        type.save()
                    }
                    else {
                        type = new Type()
                        type.name = req.body.type
                        type.courses.push(course)
                        type.save()
                    }
                })
                .catch(err=>next(err))
            course.save()
            admin.courses.push(course)
            Admin.updateOne({ name: admin.name }, admin)
                .then(() => {
                    res.redirect("/admins/home")
                })
                .catch(err => next(err))

        })
        .catch(err => console.log(err))


    }
    //edit tutorial
    edit(req, res, next) {
        Course.findOne({ slug: req.params.slug }).lean()
            .then(course => {
                res.render("edit", {
                    layout: "main2",
                    course: course
                })
            })
            .catch(err=>next(err))
    }
    edit_submit(req, res, next) {
        var errs = []
        var name = req.body.name
        var description = req.body.description
        if (!name) errs.push("vui lòng nhập tên")
        if (!description) errs.push("vui lòng nhập mô tả")
        if (errs.length != 0) {
            res.render("edit", {
                layout: "main2",
                course: {
                    name: name,
                    description: description,
                    errs: errs,
                }
            })
        }
        Course.findOne({ slug: req.params.slug })
            .then((course) => {
                course.name = name
                course.description = description
                if (req.file) {
                    var image = req.file.path.split("\\").slice(1).join("/")
                    course.image = image
                    course.save()
                    return res.redirect("/admins/home")
                }
                course.save()
                return res.redirect("/admins/home")
            })
            .catch(err => next(err))
    }
    // delete tutorial

    delete_tutorial(req, res, next) {
        Course.deleteOne({ slug: req.params.slug })
            .then(() => res.redirect("back"))
            .catch(err => next(err))
    }

    // search tutorial
    search_tutorial(req, res, next) {
        var search = req.query.search
        Course.find({ name: { $regex: search } }).lean()
            .then(courses => res.render("admin_home", {
                layout: "main2",
                courses: courses,
                search: search,
            }))
            .catch(err=> next(err))
    }


    //add video
    addvideo(req, res, next) {
        Course.findOne({ slug: req.params.slug }).lean()
            .then(courses => {
                res.render("addvideo", {
                    layout: "main2",
                    courses: courses
                })
            })
            .catch(err=>next(err))
    }
    addvideo_submit(req, res, next) {
        var coursename = req.body.coursename
        var youtube_id = req.body.youtube_id
        var stt = req.body.stt
        var name = req.body.name
        var post = req.body.post
        var errs = []
        if (!coursename) errs.push("Vui lòng nhập tên khóa học")
        if (!youtube_id) errs.push("Vui lòng nhập youtube_id")
        if (!stt) errs.push("Vui lòng nhập số thứ tự")
        if (errs.length != 0) {
            return res.render("addvideo", {
                layout: "main2",
                errs: errs,
                name: name,
                stt: stt,
                youtube_id: youtube_id,
            })
        }
        Course.findOne({ name: coursename })
            .then(course => {
                errs.push("khóa học bạn nhập không tồn tại")
                if (!course) {
                    return res.render("addvideo", {
                        layout: "main2",
                        errs: errs,
                        name: name,
                        stt: stt,
                        youtube_id: youtube_id,
                        coursename:coursename,
                        post:post,
                    })
                }
                var video = new Video({ youtube_id: youtube_id, stt: stt , post:post, name:name })
                video.save()
                course.video.push(video)
                course.save()
                return res.redirect("/admins/home")
            })
            .catch(err=>next(err))
    }
    // view video
    viewvideo(req, res, next) {
        Course.findOne({ slug: req.params.slug }).lean().populate("video").exec()
            .then(course => {
                var videos = course.video
                videos.map((val) => val.slug = req.params.slug)
                res.render("viewvideo", {
                    layout: "main2",
                    helpers: {
                        add(a, b) {
                            return a + b
                        }
                    },
                    videos: videos

                })
            })
            .catch(err=>next(err))
    }

    // edit video
    editvideo(req, res, next) {
        Video.findOne({ _id: req.params.id }).lean()
            .then((video) => res.render("editvideo", {
                layout: "main2",
                video: video,
            }))
            .catch(err => next(err))
    }
    editvideo_submit(req, res, next) {
        var stt = req.body.stt
        var youtube_id = req.body.youtube_id
        var name = req.body.name
        var post = req.body.post
        var video = {
            stt: stt,
            youtube_id: youtube_id,
            name:name,
            post:post,
        }
        var errs = []
        if (!stt) errs.push("vui lòng nhập stt")
        if (!youtube_id) errs.push("vui lòng nhập youtube_id")
        if (errs.length != 0) {
            return res.render("editvideo", {
                layout: "main2",
                video: video,
                errs: errs,
            })
        }
        Video.findOneAndUpdate({ _id: req.params.id }, video)
            .catch(err => next(err))
            .then(() => {
                return res.redirect("/admins/"+req.params.slug+"/video")
            })

    }

    // delete video

    delete_video(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then(course => {
                var i = course.video.indexOf(req.params.id)
                course.video.splice(i, i)
                Video.findByIdAndRemove(req.params.id)
                    .then(() => {
                        course.save()
                        res.redirect("back")

                    })
            })
            .catch(err => next(err))
    }

}
module.exports = new AdminController