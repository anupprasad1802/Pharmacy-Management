const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: 'This field is Required.'
    },
    brand:{
        type: String,
        required: 'This field is Required.'
    },
    description:{
        type: String,
        required: 'This field is Required.'
    },
    tags:{
        type: String,
        required: 'This field is Required.'
    },
    image:{
        type: String,
        required: 'This field is Required.'
    },
    price:{
        type: Number,
        required: 'This field is Requried.'
    },
    state:{
        type: String,
        require: 'This field is Required.'
    },
    city:{
        type: String,
        require: 'This field is Required.'
    },
    productType:{
        type: String,
        enum: ['normal','flash'],
        require: 'This field is Required.'
    },
    submitter:{
        type: String,
        require: 'This field is Required.'
    }
});

productSchema.index({name: 'text', description: 'text',tags:'text'});
//WildCard indexing
// recipeSchema.index({"$**" : 'text'});


module.exports = mongoose.model('Product',productSchema);