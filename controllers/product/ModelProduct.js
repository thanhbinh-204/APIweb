const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        default: ''
    },
    quantity: {
        type: Number,
        required: true
    },
    images: {
        type: Array,
        require: true,
        default: []
    },
    status: {
        type: String,
        required: true,
        enum: ['available', 'unavailable'],
        default: 'available'
    },
    discount: {
        type: Number,
        required: false,
        default: 0
    },
    category: {
        type: Object,
        require: true
    },
    supplier: {
        type: Object,
        required: true
    },
    feedbacks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback' 
    }],
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
