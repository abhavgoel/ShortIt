const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        required : true,
        type: String,
    } ,
    email: {
        required :true,
        unique :true,
        type :String
    } ,
    password : {
        type:String,
        required :true,
    }
});

const User = mongoose.model("user", userSchema);

module.exports = User;