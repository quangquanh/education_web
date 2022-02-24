
var site = require("../controller/SiteController")
var express = require("express")
var router = express.Router()
router.get("/", site.home)
router.get("/type/:slug", site.type)
router.post("/:slug/add", site.add)

router.get("/search", site.search)
module.exports = router
