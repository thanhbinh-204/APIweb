var express = require('express');
var router = express.Router();
const ControllerVoucher = require('../controllers/voucher/ControllerVoucher');

//http://localhost:8080//vouchers
router.get('/', async (req, res, next) => {
    try {
        const page = req.query.page;
        const limit = req.query.limit;
        const keyword = req.query.keyword;
        const categories = await ControllerVoucher.getallVoucher(page, limit, keyword);
        return res.status(200).json({ status: true, data: categories });
    } catch (error) {
        console.log('Lấy tất cả voucher lỗi: ', error);
        return res.status(500).json({ status: false, error: error });
    }
})

router.post('/createVoucher', async (req, res) => {
    try {
        const { code, description, discountValue, minimumOrder, usageLimit, startDate, endDate } = req.body;
        const result = await ControllerVoucher.createVoucher(code, description, discountValue, minimumOrder, usageLimit, startDate, endDate);
        res.status(200).json({ status: true, result });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

router.put('/updatevoucher/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        
        const updateData = req.body;

        const product = await ControllerVoucher.updateVoucher(id, updateData);

        return res.status(200).json({ status: true, data: product });
    } catch (error) {
        console.log('Cập nhật sản phẩm lỗi: ', error);
        return res.status(500).json({ status: false, error: error });
    }
})


router.post('/claimVoucher', async (req, res) => {
    try {
        const { user, voucherCode } = req.body;
        const result = await ControllerVoucher.claimVoucher(user, voucherCode);
        res.status(200).json({ status: true, result });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

router.post('/useVoucher', async (req, res) => {
    try {
        const { user, voucherCode } = req.body;
        const result = await ControllerVoucher.useVoucher(user, voucherCode);
        res.status(200).json({ status: true, result });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteVoucher/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const result = await ControllerVoucher.deleteVoucher(id);
        res.status(200).json({ status: true, result });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
})

module.exports = router;