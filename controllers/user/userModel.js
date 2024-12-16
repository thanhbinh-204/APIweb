const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    avatar: {
        type: String,
        require: false,
    },
    phonenumber: {
        type: String,
        require: false 
    },
    role: {
        type: String,
        enum: ['Customer', 'Admin', 'SuperAdmin'],
        default: 'Customer', //1: Member, 2: Admin
    },
    status: {
        type: Boolean,
        default: true, //false: tài khoản không hoạt động 
    },
    verified: {
        type: Boolean,
        default: false // Mặc định là chưa xác thực
    },
    otp: {
        type: String, // Lưu OTP tạm thời
        required: false
    },
    carts: {
        type: Array,
        default: []
    },
    vouchers: {
        type: Array,
        default: []
    },
    address: {
        type: String,
        require: false 
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    updateAt: {
        type: Date,
        default: Date.now()
    },
    lastLogin: {
        type: Date,
        default: Date.now()
    }
})



// tên colection: tiếng anh, viết thường và số ít
module.exports = mongoose.model.user || mongoose.model('User', userSchema);