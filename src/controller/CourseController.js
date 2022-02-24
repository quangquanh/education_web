var Course = require("../models/Course")
const Video = require("../models/Video")
class CourseController {
    index(req, res, next) {
        Course.findOne({ slug: req.params.slug }).lean().populate("video").exec()
            .then((course) => {
                var videos = course.video
                videos.map((val) => val.slug = req.params.slug)
                res.render("course", {
                    course: course,
                    videos: videos,
                })
            })
            .catch(err => next(err))
    }
    play(req, res, next) {
        Course.findOne({ slug: req.params.slug }).lean().populate("video").exec()
            .then((course) => {
                Video.findOne({ stt: req.params.id }).lean()
                    .then((video) => {
                        var videos = course.video
                        videos.map((val) => val.slug = req.params.slug)
                        res.render("playvideo", {
                            course: course,
                            videos: videos,
                            video:video,
                        })
                    })
                    .catch(err => next(err))
            })
            .catch(err => next(err))
    }
}
module.exports = new CourseController