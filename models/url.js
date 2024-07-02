const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortenedUrl : {
        type:String,
        required : true,
        unique:  true
    }, 
    redirectUrl : {
        type : String,
        required: true
    },
    visitHistory : [{timestamp: {type: Number}}],
    
    createdBy :{ // linking users document with links, so that we can reference only user specific links
        type: mongoose.Schema.Types.ObjectId,
        ref : "users"
    }
}, 
    {timestamps : true}

);

const URL = mongoose.model('urls', urlSchema);

module.exports = URL;