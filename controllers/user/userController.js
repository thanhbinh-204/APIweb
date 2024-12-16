const { now } = require('mongoose');
const userModel = require('../user/userModel');
const bcrypt = require('bcryptjs');
const { sendOTP, sendNewPassword } = require('../../util/mailer');
const randomstring = require("randomstring");


// Register:
// 1: Nhận dữ liệu (username, password, email) từ user.js
// 2: kiểm tra dữ liệu đầu vào (validate)
// 3: Nếu ok thì sẽ tạo account --> trả acc cho user.js
// 4: Nếu không ok thì trả lỗi
const register = async (email, password, username) => {
    try {
        // Kiểm tra xem email có tồn tại không
        let userInDB = await userModel.findOne({ email });
        if (userInDB) {
            throw new Error('Email đã tồn tại');
        }

        if (password && password.length < 6) {
            throw new Error('Mật khẩu phải dài hơn 6 kí tự');
        }

        // Mã hóa mật khẩu
        const salt = bcrypt.genSaltSync(10);
        const hashedpassword = bcrypt.hashSync(password, salt);

        // Tạo mã OTP
        const otp = randomstring.generate({ length: 4, charset: 'numeric' });

        // Gửi OTP qua email
        await sendOTP(email, otp);

        // Tạo user với trạng thái chưa xác minh và lưu OTP vào database
        user = new userModel({ email, password: hashedpassword, username, otp, verified: false });
        const result = await user.save();

        return result;
    } catch (error) {
        console.log('Register error:', error.message);
        throw new Error(error.message);
    }
};

// Gữi mã xác minh OTP mới
const newverifyOTP = async (email) => {
    try {
        // Tìm user với email và otp
        const userInDB = await userModel.findOne({ email });
        if (!userInDB) {
            throw new Error('Tài khoản không tồn tại');
        }

        // Tạo mã OTP
        const otp = randomstring.generate({ length: 4, charset: 'numeric' });

        // Gửi OTP qua email
        await sendOTP(email, otp);

        userInDB.otp = otp;
        await userInDB.save();

        return { message: 'Đã gửi mã xác thực.' };
    } catch (error) {
        console.log('Error:', error.message);
        throw new Error('Không thể gửi mã xác thực');
    }
};

// Xác minh OTP
const verifyOTP = async (email, otp) => {
    try {
        // Tìm user với email và otp
        const userInDB = await userModel.findOne({ email, otp });
        if (!userInDB) {
            throw new Error('OTP không đúng hoặc tài khoản không tồn tại');
        }

        // Cập nhật trạng thái xác thực và xóa OTP sau khi xác minh
        userInDB.verified = true;
        userInDB.otp = null;
        await userInDB.save();

        return { message: 'Email đã được xác thực thành công' };
    } catch (error) {
        console.log('OTP Verification Error:', error.message);
        throw new Error('Không thể xác thực OTP');
    }
};

// Quên mật khẩu
const forgetpassword = async (email) => {
    try {
        let userInDB = await userModel.findOne({ email });
        if (!userInDB) {
            throw new Error('Email không tồn tại');
        }
        // tạo mật khẩu mới
        const newPassword = randomstring.generate({ length: 7, charset: 'alphanumeric' });

        // gửi pass mới về mail
        await sendNewPassword(email, newPassword);

        // Mã hóa mật khẩu
        const salt = bcrypt.genSaltSync(10);
        const hashedpassword = bcrypt.hashSync(newPassword, salt);

        userInDB.password = hashedpassword
        userInDB.updateAt = new Date();
        await userInDB.save();

        return { email: userInDB.email, updateAt: userInDB.updateAt };

    } catch (error) {
        console.log('Error: quên mật khẩu', error.message);
        throw new Error(error.message);
    }
}


const login = async (email, password) => {
    try {
        let userInDB = await userModel.findOne({ email });

        // Kiểm tra xem email có tồn tại hay không
        if (!userInDB) {
            throw new Error('Email không tồn tại');
        }

        // Kiểm tra xem tài khoản đã được xác thực chưa
        if (!userInDB.verified) {
            throw new Error('Tài khoản chưa được xác thực');
        }

        userInDB.lastLogin = new Date();
        await userInDB.save();

        // Kiểm tra mật khẩu
        const result = bcrypt.compareSync(password, userInDB.password);
        if (result) {
            return userInDB;
        } else {
            throw new Error('Không đúng mật khẩu!');
        }
    } catch (error) {
        console.log('Error: đăng nhập', error.message);
        throw new Error(error.message);
    }
};

/**UPDATE 
 * - Nhân dữ liệu: email, newUsername ,newPassword,
*/


const updateuser = async (id, username, password, avatar, phonenumber, address, role) => {

    try {
        let userid = await userModel.findById(id);
        if (!userid) {
            throw new Error('Id không hợp lệ!');
        }
        if (password && password.length < 6) {
            throw new Error('Mật khẩu phải dài hơn 6 kí tự');
        }

        if (phonenumber && phonenumber.length !== 10) {
            throw new Error('Số điện thoại phải đủ 10 số');
        }

        // Mã hóa mật khẩu khi được cung cấp mật khẩu mới
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            userid.password = bcrypt.hashSync(password, salt);
        }

        // Edit data
        userid.username = username || userid.username
        userid.phonenumber = phonenumber || userid.phonenumber
        userid.address = address || userid.address
        userid.avatar = avatar || userid.avatar
        userid.role = role || userid.role
        userid.updateAt = new Date();
        await userid.save();

        return {
            _id: userid._id,
            username: userid.username,
            phonenumber: userid.phonenumber,
            address: userid.address,
            updateAt: userid.updateAt
        };

    } catch (error) {
        console.log('Error: ', error);
        throw new Error('Error when update user')
    }
}

const deleteuser = async (id) => {

    try {
        let user = await userModel.findById({ id });
        if (!user) {
            throw new Error('Id khong hop le !')
        }
        // Edit data

        const result = await userModel.deleteOne({ _id: id });
        return result;

    }
    catch (error) {
        console.log('Error: ', error);
        throw new Error('Error when delete user')
    }
}

const getAllCustomers = async (page, limit, keyword) => {
    try {
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        let skip = (page - 1) * limit;
        let sort = { create_at: -1 };// 1: tăng dần, -1: giảm dần
        // query : điều kiện tìm kiếm
        let query = {};// nếu là 1 object rõng là không có điều kiện tìm kiếm
        query = {
            role: 1
        }
        let allCustomers = await userModel
            .find(query)
            // Bỏ qua bao nhiêu sản phẩm
            .skip(skip)
            // Giới hạn số lượng sản phẩm 
            .limit(limit)
            // Sắp xếp theo thời gian tạo
            .sort(sort);
        return allCustomers;
    } catch (error) {
        console.log('Lấy danh sách khách hàng lỗi: ', error);
        throw new Error('Lấy danh sách khách hàng lỗi');
    }
}

const getCustomerbyID = async (userID) => {
    try {
        let userInDB = await userModel.findById(userID);
        if (!userInDB) {
            throw new Error('ID người dùng không tồn tại.');
        }

        return userInDB;

    } catch (error) {
        console.log('Lấy người dùng lỗi: ', error);
        throw new Error('Lấy người dùng lỗi');
    }
}

const getAllAdmins = async (page, limit, keyword) => {
    try {
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        let skip = (page - 1) * limit;
        let sort = { create_at: -1 };// 1: tăng dần, -1: giảm dần
        // query : điều kiện tìm kiếm
        let query = {};// nếu là 1 object rõng là không có điều kiện tìm kiếm
        query = {
            role: 'Admin'
        }


        let allCustomers = await userModel
            .find(query)
            // Bỏ qua bao nhiêu sản phẩm
            .skip(skip)
            // Giới hạn số lượng sản phẩm 
            .limit(limit)
            // Sắp xếp theo thời gian tạo
            .sort(sort);
        return allCustomers;
    } catch (error) {
        console.log('Lấy danh sách khách hàng lỗi: ', error);
        throw new Error('Lấy danh sách khách hàng lỗi');
    }
} 

const registerAdmin = async (email, password, username, role) => {
    try {
        // Kiểm tra xem email có tồn tại không
        let userInDB = await userModel.findOne({ email });
        if (userInDB) {
            throw new Error('Email đã tồn tại');
        }

        if (password && password.length < 6) {
            throw new Error('Mật khẩu phải dài hơn 6 kí tự');
        }

        // Mã hóa mật khẩu
        const salt = bcrypt.genSaltSync(10);
        const hashedpassword = bcrypt.hashSync(password, salt);

        // Tạo user với trạng thái chưa xác minh và lưu OTP vào database
        user = new userModel({ email, password: hashedpassword, username, verified: true, role });
        const result = await user.save();

        return result;
    } catch (error) {
        console.log('Register error:', error.message);
        throw new Error(error.message);
    }
};



module.exports = { register, login, updateuser, deleteuser, 
    verifyOTP, forgetpassword, newverifyOTP, getAllCustomers,
     getCustomerbyID, getAllAdmins, registerAdmin }