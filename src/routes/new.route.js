var express = require("express")
var router = express.Router()
var newcontroller = require("../controller/NewController")
router.get("/", newcontroller.index)
module.exports = router