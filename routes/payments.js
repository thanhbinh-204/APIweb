var express = require('express');
var router = express.Router();
var app = express();
const axios = require("axios");
const crypto = require('crypto');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
var accessKey = 'F8BBA842ECF85';


// router.post('/paymentMomo', async (req, res) => {
//     //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//     //parameters
//     var orderInfo = 'pay with MoMo';
//     var partnerCode = 'MOMO';
//     var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
//     var ipnUrl = 'https://0193-171-252-154-157.ngrok-free.app/callback';
//     var requestType = "payWithMethod";
//     var amount = '50000';
//     var orderId = partnerCode + new Date().getTime();
//     var requestId = orderId;
//     var extraData = '';
//     var orderGroupId = '';
//     var autoCapture = true;
//     var lang = 'vi';

//     //before sign HMAC SHA256 with format
//     //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
//     var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
//     //puts raw signature
//     console.log("--------------------RAW SIGNATURE----------------")
//     console.log(rawSignature)
//     //signature
//     const crypto = require('crypto');
//     var signature = crypto.createHmac('sha256', secretKey)
//         .update(rawSignature)
//         .digest('hex');
//     console.log("--------------------SIGNATURE----------------")
//     console.log(signature)

//     //json object send to MoMo endpoint
//     const requestBody = JSON.stringify({
//         partnerCode: partnerCode,
//         partnerName: "Test",
//         storeId: "MomoTestStore",
//         requestId: requestId,
//         amount: amount,
//         orderId: orderId,
//         orderInfo: orderInfo,
//         redirectUrl: redirectUrl,
//         ipnUrl: ipnUrl,
//         lang: lang,
//         requestType: requestType,
//         autoCapture: autoCapture,
//         extraData: extraData,
//         orderGroupId: orderGroupId,
//         signature: signature
//     });

//     // option for axios
//     const options = {
//         method: 'POST',
//         url: "https://test-payment.momo.vn/v2/gateway/api/create",
//         headers: {
//             'Content-Type': 'application/json',
//             'Content-Lenght': Buffer.byteLength(requestBody),
//         },
//         data: requestBody
//     }

//     let result;
//     try {
//         result = await axios(options);
//         return res.status(200).json(result.data);

//     } catch (error) {
//         return res.status(500).json({
//             statusCode: 500,
//             message: "Sever error"
//         })
//     }

// })

router.post('/paymentMomo', async (req, res) => {
    // Nhận các tham số từ request body
    var { orderId, amount, orderInfo, redirectUrl  } = req.body;

    var partnerCode = 'MOMO';  // Mã đối tác
    var redirectUrl = redirectUrl;  // URL chuyển hướng sau khi thanh toán
    var ipnUrl = 'https://1439-2402-800-63b6-d034-fcdd-6947-e35f-49b5.ngrok-free.app/callback';  // URL để nhận kết quả thanh toán
    var requestType = "captureWallet";  // Phương thức thanh toán
    var requestId = orderId;  // ID yêu cầu
    var extraData = '';  // Dữ liệu bổ sung (nếu có)
    var orderGroupId = '';  // Nhóm đơn hàng (nếu cần)
    var autoCapture = true;  // Tự động xác nhận thanh toán
    var lang = 'vi';  // Ngôn ngữ

    // Tạo chữ ký HMAC SHA256
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    console.log("Raw signature: ", rawSignature);

    // Chữ ký HMAC SHA256
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("Signature: ", signature);

    // Tạo request body gửi đến MoMo API
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature
    });

    // Gửi yêu cầu đến MoMo API
    const options = {
        method: 'POST',
        url: "https://test-payment.momo.vn/v2/gateway/api/create",  // URL của MoMo API
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody),
        },
        data: requestBody
    }

    try {
        const result = await axios(options);
        // Trả về URL thanh toán cho người dùng
        console.log(result.data);
        return res.status(200).json(result.data);  // URL để chuyển hướng người dùng tới trang thanh toán
    } catch (error) {
        console.error('MoMo Payment API Error:', error);
        return res.status(500).json({
            statusCode: 500,
            message: "Server error"
        });
    }
});



router.post('/callback', (req, res) => {
    console.log('callback::');
    console.log(req.body);

    return res.status(200).json(req.body);
});


router.post('/transaction-status', async (req, res) => {
    const { orderId } = req.body;

    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`

    const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode: "MOMO",
        requestId: orderId,
        orderId: orderId,
        signature: signature,
        lang: 'vi'
    })

    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/query",
        headers: {
            'Content-Type': "application/json"
        },
        data: requestBody
    }


    try {
        let result = await axios(options);
        return res.status(200).json(result.data);

    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Sever error"
        })
    }

})

module.exports = router;