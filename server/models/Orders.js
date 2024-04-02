const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items:{
        type: Array,
        required: 'This field is Required.'
    },
    buyerName: {
        type: String,
        required: 'This field is Required.'
    },
    address: {
        type: String,
        require: 'This field is Required.'
    },
    totalPrice: {
        type: Number,
        require: 'This field is Required.'
    },
    status:{
        type: String,
        enum: ['out','delivered'],
        require: 'This field is Required.'
    }
});


module.exports = mongoose.model('Orders', orderSchema);