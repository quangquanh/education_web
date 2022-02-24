const mongoose = require("mongoose")
const { Schema } = mongoose

const User = new Schema({
    name: String,
    email: String,
    password: String,
    avatar: String,
    courses: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
    ],
    createAt: { type: Date, default: Date.now() },
})
module.exports = mongoose.model("user", User)