const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true }
    },
    products: [
        {
            _id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            image:{ type: String, required: true, default: []},
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        }
    ],
    total: {
        type: Number, 
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
