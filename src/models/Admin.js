const mongoose = require("mongoose")
const {Schema} = mongoose

const Admin = Schema({
    name:String,
    password:String,
    courses :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }],
    createAt:{type:Date,default:Date.now()},
})
module.exports = mongoose.model("Admin",Admin)