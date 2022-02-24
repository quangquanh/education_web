const Mongoose = require("mongoose")
async function connect() {
    try {
        await Mongoose.connect('mongodb+srv://quang227:ugVaHYBCKRncavad@cluster0.eqvwq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
        //mongodb+srv://quang227:ugVaHYBCKRncavad@cluster0.eqvwq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
        console.log("đã kết nối thành công")
    }
    catch (err) {
        console.log(err)
    }
}
module.exports = { connect }