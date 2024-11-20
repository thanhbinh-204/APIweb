const mongoose = require('mongoose');

const VoucherSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    description: String,
    discountValue: { type: Number, required: true },
    minimizeOrder: Number,
    usageLimit: {
        type: Number,
        default: 1 // Tổng số lần có thể dùng
    },
    usedCount: {
        type: Number,
        default: 0 // Số lần đã sử dụng
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.models.Voucher || mongoose.model('Voucher', VoucherSchema);