var express = require('express');
var router = express.Router();
const userController = require('../controllers/user/userController');

//http://localhost:8080//users

// Register
// method : POST
// url: //http://localhost:8080/users/register
// response: nếu thành công trả về đúng user mới tạo, 
//           nếu thất bại trả về error


//router: điều hướng tín hiệu dùng để gửi và nhận phản hồi của db
// Đăng ký và gửi OTP
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;
  try {
      const result = await userController.register(email, password, username);
      res.status(200).json({ message: 'OTP đã được gửi đến email của bạn', status: true, result });
  } catch (error) {
      res.status(400).json({status: false, message: error.message });
  }
});

// Xác thực OTP
router.post('/verifyOTP', async (req, res) => {
  const { email, otp } = req.body;
  try {
      const result = await userController.verifyOTP(email, otp);
      res.status(200).json({status: true, result});
  } catch (error) {
      res.status(400).json({status: false, message: error.message });
  }
});

// Gửi lại mã xác thực
router.post('/ReOTP', async (req, res) => {
  const { email } = req.body;
  try {
      const result = await userController.newverifyOTP(email);
      res.status(200).json({status: true, result});
  } catch (error) {
      res.status(400).json({status: false, message: error.message });
  }
});

// quên mật khẩu
router.post('/forgetpassword', async (req, res) => {
  const { email } = req.body;
  try {
      const result = await userController.forgetpassword(email);
      res.status(200).json({status: true, result});
  } catch (error) {
      res.status(400).json({status: false, message: error.message });
  }
});



// Login
// method : POST
// url: http://localhost:6666/users/login
// response: trả về người dùng// null

router.post('/login', async (req, res, next) => {
  //1: Đọc dữ liệu từ client gửi về, req.body
  const { email, password} = req.body;
  try {
    //2: Xử lý yêu cầu (không viết ở đây)
    let result = await userController.login(email, password);

    //3: Gửi phản hồi về client:  
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    return res.status(400).json({ status: false, data: error.message });
  }


})

// Update
// method : put
// url: http://localhost:6666/users/update_profile
// response: trả về người dùng// null

router.put('/update_profile/:id', async (req, res, next) => {
  const {id}= req.params
  const { username, password, avatar, phonenumber, address, role} = req.body;
  try {
    let result = await userController.updateuser(id, username, password, avatar, phonenumber, address, role);
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    return res.status(400).json({ status: false, data: error.message });
  }
});


// Update
// method : delete
// url: http://localhost:6666/users/delete
// response: xóa
router.delete('/delete/:id', async (req, res, next) => {
  try {
    const {id}= req.params
   const result= await userController.deleteuser(id);
   if(result){
    return res.status(200).json({ status: true, message:'Thành công !' });
   }else{
    return res.status(400).json({ status: false, message:'Thất bại !' });
   }
    
  } catch (error) {
    return res.status(400).json({ status: false, data: error.message });
  }
});


router.get('/customers', async function (req, res, next) {
  try {
      const page = req.query.page;
      const limit = req.query.limit;
      const keyword = req.query.keyword;
      const categories = await userController.getAllCustomers(page, limit, keyword);
      return res.status(200).json({ status: true, data: categories });
  } catch (error) {
      console.log('Lấy tất danh sách khách hàng lỗi: ', error);
      return res.status(400).json({ status: false, error: error });
  }
})

router.post('/customerByID/:id', async function (req, res, next) {
  try {
      const {id} = req.params;
      const categories = await userController.getCustomerbyID(id);
      return res.status(200).json({ status: true, data: categories });
  } catch (error) {
      console.log('Lấy tất danh sách khách hàng lỗi: ', error);
      return res.status(400).json({ status: false, error: error });
  }
})

router.get('/admins', async function (req, res, next) {
  try {
      const page = req.query.page;
      const limit = req.query.limit;
      const keyword = req.query.keyword;
      const categories = await userController.getAllAdmins(page, limit, keyword);
      return res.status(200).json({ status: true, data: categories });
  } catch (error) {
      console.log('Lấy tất danh sách admin lỗi: ', error);
      return res.status(400).json({ status: false, error: error });
  }
})

router.post('/registerAdmin', async (req, res) => {
  const { email, password, username, role } = req.body;
  try {
      const result = await userController.registerAdmin(email, password, username, role);
      res.status(200).json({ status: true, result });
  } catch (error) {
      res.status(400).json({status: false, message: error.message });
  }
});


module.exports = router;
