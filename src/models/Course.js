const mongoose = require("mongoose")
slug = require("mongoose-slug-generator")
mongoose.plugin(slug)
const {Schema} = mongoose
const Course = new Schema({
    name: {type:String,maxLength:255},
    type:String,
    description: {type:String,maxLength:255},
    image: {type:String,maxLength:255},
    video:[{type:Schema.Types.ObjectId,ref:"Video"}],
    slug:{type : String,slug:"name",unique:true},
    view:{type:Number,default:0},
    createAt:{type:Date,default:Date.now()},
    admin:String,
})
Course.index({name:'text',description:'text',admin:'text'})
module.exports = mongoose.model("Course",Course)

 