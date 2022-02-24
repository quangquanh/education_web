var express = require("express")
var { engine } = require('express-handlebars');
var path = require("path")
var app = express()
var port = process.env.PORT || 3000

app.use(express.static('public'));


app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "resources", "views"))

app.use(express.urlencoded())
app.use(express.json())

var cookieParser = require('cookie-parser')
app.use(cookieParser())

var siterouter = require("./routes/site.route")
var newrouter = require("./routes/new.route")
var courserouter = require("./routes/course.route")
var sign_up_router = require("./routes/user.route")
var adminrouter = require("./routes/admin.route")

var authmiddleware = require("./middleware/auth.middlewale")
// route
app.use("/home", authmiddleware, siterouter)
app.use("/news", authmiddleware, newrouter)
app.use("/course",authmiddleware, courserouter)
app.use("/user", sign_up_router)
app.use("/admins", adminrouter)

app.get("/",(req,res)=> res.redirect("/home"))

app.listen(port, () => console.log(`mở web tại http://localhost:${port}/`))

const db = require("./db");
db.connect()
