var express = require('express');
var router = express.Router();

// http://localhost:8080/carts

const ControllerCart = require('../controllers/carts/ControllerCart');


// Thêm giỏ hàng mới
// method : POST
// body: { user, products }
// url: http://localhost:8080/carts
// return: { _id, user, product, total, status, date }
router.post('/add', async (req, res, next) => {
    try {
        const { user, products} = req.body;
        const result = await ControllerCart.addCart(user, products);

        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        return res.status(400).json({ status: false, data: error.message });
    }
})

router.get('/all', async (req, res) => {
    try {
        const carts = await ControllerCart.getAllCarts();
        return res.status(200).json({ status: true, data: carts });
    } catch (error) {
        console.error('Lỗi khi lấy tất cả giỏ hàng:', error.message);
        return res.status(500).json({ status: false, error: 'Lỗi khi lấy tất cả giỏ hàng' });
    }
});

// Get giỏ hàng
// method : POST
// body: { user, products }
// url: http://localhost:8080/carts
// return: { _id, user, product, total, status, date }
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const carts = await ControllerCart.getCartsByUserId(userId);
        
        if (carts.length === 0) {
            return res.status(404).json({ status: false, error: 'Không tìm thấy giỏ hàng cho người dùng này' });
        }
        
        return res.status(200).json({ status: true, data: carts });
    } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng theo ID người dùng:', error.message);
        return res.status(500).json({ status: false, error: 'Lỗi khi lấy giỏ hàng theo ID người dùng' });
    }
});

router.put('/status/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Lấy trạng thái mới từ body
        const updatedCart = await ControllerCart.updateStatus(id, { status });
        if (!updatedCart) {
            return res.status(404).json({ status: false, error: 'Giỏ hàng không tồn tại' });
        }
        return res.status(200).json({ status: true, data: updatedCart });
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái giỏ hàng:', error.message);
        return res.status(500).json({ status: false, error: 'Lỗi khi cập nhật trạng thái giỏ hàng' });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Lấy trạng thái mới từ body
        const updatedCart = await ControllerCart.updateStatus(id, { status });
        if (!updatedCart) {
            return res.status(404).json({ status: false, error: 'Giỏ hàng không tồn tại' });
        }
        return res.status(200).json({ status: true, data: updatedCart });
    } catch (error) {
        console.error('Lỗi khi cập nhật:', error.message);
        return res.status(500).json({ status: false, error: 'Lỗi' });
    }
});

module.exports = router;