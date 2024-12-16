const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoryShema = new Schema({
    name:{
        type: String,
        require: true
    },
    brand:{
        type: String,
        require: true
    },
    image: {
        type: Array,
        require: true,
        default: []
    },
    create_at:{
        type: Date,
        default: Date.now
    },
    update_at:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.models.category || mongoose.model('Category', CategoryShema);