const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    user: { 
        type: Object,
        required: true 
    },
    quality: { 
        type: String,
        required: true 
    },
    content: { 
        type: String,
        required: true 
    },
    rating: { 
        type: Number, 
        min: 1, 
        max: 5, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        default: 'visible' 
    },
    productId: {
        type: Object,
        required: true,
        ref: 'products'
    }
});


module.exports = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
