const mongoose = require("mongoose")
const {Schema} = mongoose

var Video = Schema({
    youtube_id:String,
    stt:Number,
    name:String,
    post:String,
})
module.exports = mongoose.model("Video",Video)