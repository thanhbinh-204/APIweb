var express = require('express');
var router = express.Router();
const ControllerCategories = require('../controllers/categories/ControllerCategories');
const { param } = require('./users');

//http://localhost:9999/categories?page=1&limit=5&keyword=.....
router.get('/getallCate', async function (req, res, next) {
    try {
        const page = req.query.page;
        const limit = req.query.limit;
        const keyword = req.query.keyword;
        const categories = await ControllerCategories.getCategories(page, limit, keyword);
        return res.status(200).json({ status: true, data: categories });
    } catch (error) {
        console.log('Lấy tất tat cả danh muc lỗi: ', error);
        return res.status(500).json({ status: false, error: error });
    }
})

router.post('/addCate', async function (req, res, next) {
    try {
        const { name, brand, image} = req.body;
        const categories = await ControllerCategories.addcate(name, brand, image);
        return res.status(200).json({ status: true, data: categories});
    } catch (error) {
        console.log('Thêm danh sách lỗi', error);
        return res.status(500).json({ status: false, error: error});
    }
})

router.put('/updateCate/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        const { name, brand, image } = req.body;

        const updatedCategory = await ControllerCategories.updateCate(id, name, brand, image);
        
        return res.status(200).json({ status: true, data: updatedCategory });
    } catch (error) {
        console.log('Chỉnh sửa danh mục lỗi', error);
        return res.status(500).json({ status: false, error: error.message });
    }
});

router.delete('/deleteCate/:id', async function (req, res, next) {
    try {
        const {id} = req.params;
        const categories = await ControllerCategories.deleteCate(id);
        return res.status(200).json({ status: true, data: categories});
    } catch (error) {
        console.log('Xóa danh sách lỗi', error);
        return res.status(500).json({ status: false, error: error});
    }
})

module.exports = router;
