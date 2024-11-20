const express = require('express');
const router = express.Router();
const ControllerFeedback = require('../controllers/feedback/ControllerFeedback');

// đánh giá sản phẩm
router.post('/addFeedback', async (req, res) => {
    const { user, quality, content, rating, productId } = req.body;
    try {
        const result = await ControllerFeedback.addFeedback(user, quality, content, rating, productId);
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
});

// hiển thị đánh giá của sản phẩm
router.get('/getfeedback/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const result = await ControllerFeedback.getFeedbacksByProductId(productId);
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
});

router.get('/getfeedbacks', async (req, res) => {
    try {
        const page = req.query.page;
        const limit = req.query.limit;
        const keyword = req.query.keyword;
        const result = await ControllerFeedback.getAllFeedbacks(page, limit, keyword);
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

module.exports = router;
