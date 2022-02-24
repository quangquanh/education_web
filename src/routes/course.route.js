const express = require("express")
const router = express.Router()
const courseController = require("../controller/CourseController")
router.get("/:slug", courseController.index)
router.get("/:slug/:id", courseController.play)
module.exports = router