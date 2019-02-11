var mongoose = require('mongoose');
const user = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    },
    userName: {
        type:String,
        required:true,
        minlength:5,
        maxlength:255
    },
    password: {
        type:String,
        required:true,
        minlength:5,
        maxlength:2024,
    }
})

module.exports = mongoose.model('User',user);