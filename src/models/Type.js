const mongoose = require("mongoose")
const { Schema } = mongoose
const slug = require("mongoose-slug-generator")
mongoose.plugin(slug)

var Type = Schema({
    name: String,
    slug: { type: String, slug: "name", unique: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
})
module.exports = mongoose.model("Type", Type)