const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: 'This field is Required.'
    },
    lname: {
        type: String,
        required: 'This field is Required.'
    },
    email: {
        type: String,
        require: 'This field is Required.'
    },
    address:{
        type: String,
        required: 'This field is Required.'
    },
    cart: {
        type: Array,
        required: 'This field is Required.'
    },
    type: {
        type: Number,
        require: 'This field is Required'
    },
    password: {
        type: String,
        require: 'This field is Required.'
    }
});


module.exports = mongoose.model('User', userSchema);