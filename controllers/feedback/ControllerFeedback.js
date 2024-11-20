const Feedback = require('../feedback/ModelFeedback');
const Product = require('../product/ModelProduct');
const User = require('../user/userModel')

// Đánh giá sản phẩm
const addFeedback = async (user, quality, content, rating, productId) => {
    try {
        const userId = await User.findById(user);
        if (!userId) {
            throw new Error('Người dùng không tồn tại');
        }

        const productDB = await Product.findById(productId);
        if (!productDB) {
            throw new Error('Sản phẩm không tồn tại');
        }

        // Kiểm tra các trường bắt buộc
        if (!userId || !quality || !content || rating === undefined || !productId) {
            throw new Error('Tất cả các trường là bắt buộc.');
        }

        // kiểm tra người dùng đã đánh giá sản phẩm này hay chưa
        const existingFeedback = await Feedback.findOne({
            'user.id': userId,  
            productId: productId 
        });
        
        if (existingFeedback) {
            throw new Error('Người dùng đã đánh giá cho sản phẩm.');
        }

        

        // Tạo một đánh giá mới
        const newFeedback = new Feedback({
            user: { id: user, name: userId.username },
            quality,
            content,
            rating,
            productId: { id: productId, name: productDB.name},
        });

        // Lưu đánh giá vào cơ sở dữ liệu
        const savedFeedback = await newFeedback.save();

        // Cập nhật sản phẩm với ID của đánh giá mới
        await Product.findByIdAndUpdate(
            productId,
            { $push: { feedbacks: savedFeedback._id } },
            { new: true }
        );

        return {
            status: true,
            message: "Đánh giá đã được thêm thành công.",
            feedback: savedFeedback, // Trả về phản hồi đã lưu

        };
    } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi thêm đánh giá.');
    }
};

// Hiển thị tất cả đánh giá của một sản phẩm
const getFeedbacksByProductId = async (productId) => {
    try {

        const product = await Product.findById(productId).populate('feedbacks');

        if (!product) {
            throw new Error('Sản phẩm không tồn tại.');
        }

        return { status: true, feedbacks: product.feedbacks };
    } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy đánh giá.');
    }
};


const getAllFeedbacks = async (page, limit, keyword) => {
    try {
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        let skip = (page - 1) * limit;
        let sort = { create_at: -1 };// 1: tăng dần, -1: giảm dần
        // query : điều kiện tìm kiếm
        let query = {};// nếu là 1 object rõng là không có điều kiện tìm kiếm
        query = {
            ...query,

        }

        let feedbacks = Feedback
            .find(query)
            // Bỏ qua bao nhiêu sản phẩm
            .skip(skip)
            // Giới hạn số lượng sản phẩm 
            .limit(limit)
            // Sắp xếp theo thời gian tạo
            .sort(sort);
        return feedbacks;
    } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách đánh giá.');
    }
};


module.exports = { addFeedback, getFeedbacksByProductId, getAllFeedbacks };

