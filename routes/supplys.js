var express = require('express');
var router = express.Router();
const ControllerSupplier = require('../controllers/supply/ControllerSupply');

// Đường dẫn: http://localhost:8080/api/suppliers

router.get('/', async function (req, res, next) {
    try {
        const page = req.query.page;
        const limit = req.query.limit;
        const keyword = req.query.keyword;
        const categories = await ControllerSupplier.getSuppliers(page, limit, keyword);
        return res.status(200).json({ status: true, data: categories });
    } catch (error) {
        console.log('Lấy tất cả nhà cung cấp lỗi: ', error);
        return res.status(500).json({ status: false, error: error });
    }
})

// Thêm nhà cung cấp
router.post('/addSupplier', async (req, res) => {
    try {
        const { name } = req.body; // Lấy thông tin từ body của request
        const result = await ControllerSupplier.addSupplier(name); // Gọi hàm addSupplier trong controller
        res.status(201).json({ status: true, result });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

// Cập nhật nhà cung cấp
router.put('/updateSupplier/:id', async (req, res) => {
    const { id } = req.params; 
    const { name } = req.body; 
    try {
        const result = await ControllerSupplier.updateSupplier(id, name); 
        res.status(200).json({ status: true, result });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

// Xóa nhà cung cấp
router.delete('/deleteSupplier/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await ControllerSupplier.deleteSupplier(id); 
        res.status(200).json({ status: true, result });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

module.exports = router;
