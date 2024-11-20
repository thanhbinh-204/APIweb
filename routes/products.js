var express = require('express');
var router = express.Router();
const ControllerProduct = require('../controllers/product/ControllerProduct');



// http:/localhost:8080/products

// Get all product
// method : GET
// url: http://localhost:8080/products?page=1&limit=10&keyword=.....
// response: mảng sản phẩm

router.get('/getallproduct', async function (req, res, next) {
    try {
        const page = req.query.page;
        const limit = req.query.limit;
        const keyword = req.query.keyword;
        const product = await ControllerProduct.getAll(page, limit, keyword);
        return res.status(200).json({ status: true, data: product });
    } catch (error) {
        console.log('Lấy tất cả sản phẩm lỗi: ', error);
        return res.status(500).json({ status: false, error: error });
    }
})

// Insert product
// method : POST
// url: http://localhost:8080/products
// body: {name, peice, quantity, images, description, category}
// response: Sản phẩm mới

router.post('/addproduct', async function (req, res, next) {
    try {
        const { name, price, quantity, images, description, category, supplier} = req.body;
        const product = await ControllerProduct.insertDB(name, price, quantity, images, description, category, supplier);

        return res.status(200).json({ status: true, data: product });
    } catch (error) {
        console.log('Thêm sản phẩm lỗi: ', error);
        return res.status(500).json({ status: false, error: error });
    }
})

// Cập nhật sản phẩm theo product_id
// method : PUT
// url: http://localhost:8080/products
// body: {name, peice, quantity, images, description, category}
// response: Sản phẩm mới

router.put('/update_product/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        
        const updateData = req.body;

        const product = await ControllerProduct.updateDB(id, updateData);

        return res.status(200).json({ status: true, data: product });
    } catch (error) {
        console.log('Cập nhật sản phẩm lỗi: ', error);
        return res.status(500).json({ status: false, error: error });
    }
})


// Tìm kiếm sản phẩm theo product_id
// method : POST
// url: http://localhost:8080/products
//
// response: Sản phẩm

router.post('/find_product', async function (req, res, next) {
    try {
        const { name } = req.body;
        const product = await ControllerProduct.findProduct(name);

        return res.status(200).json({ status: true, data: product });
    } catch (error) {
        console.log('Tìm kiếm lỗi! ', error);
        return res.status(500).json({ status: false, error: error });
    }
})


router.post('/getproductID/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        const product = await ControllerProduct.getProductID(id);

        return res.status(200).json({ status: true, data: product });
    } catch (error) {
        console.log('Tìm kiếm lỗi!! ', error);
        return res.status(500).json({ status: false, error: error });
    }
})

router.post('/getproductbycate/:categoryId', async function (req, res, next) {
    try {
        const { categoryId } = req.params;
        const product = await ControllerProduct.findProductByCategory(categoryId);

        return res.status(200).json({ status: true, data: product });
    } catch (error) {
        console.log('Tìm kiếm lỗi!! ', error);
        return res.status(500).json({ status: false, error: error });
    }
})


// Xóa sản phẩm theo product_id
// method : DELETE
// url: http://localhost:8080/products/:id
// response: {status: true}

router.delete('/delete/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        const result = await ControllerProduct.remove(id);

        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log('Cập nhật sản phẩm lỗi: ', error);
        return res.status(500).json({ status: false, error: error });
    }
})




router.get('/top/best-10?top-10', async function (req, res, next) {
    try {     
        const result = await ControllerProduct.getBestProduct();
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log('Lay 10 sản phẩm lỗi: ', error);
        return res.status(500).json({ status: false, error: error });
    }
})







// add data
// method : GET
// url: http://localhost:8080/products/dump
// response: add data

router.get('/dump', async function (req, res, next) {
    try {
        const result = await ControllerProduct.insertData();
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log('Thêm lỗi: ', error);
        return res.status(500).json({ status: false, error: error });
    }
})


module.exports = router;