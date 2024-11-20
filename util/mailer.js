const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "hoctrinhf04@gmail.com",
        pass: "ydum shdb aftj agqi",
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Hàm tạo và gửi OTP
function sendOTP(email, otp) {
    const mailOptions = {
        from: '"MenT Perfume" <hoctrinhf04@gmail.com>',
        to: email,
        subject: 'Xác thực Email',
        text: `Mã OTP của bạn để xác thực tài khoản là: ${otp}`
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred while sending OTP:', error);
                reject(error);
            } else {
                console.log('OTP Email sent successfully:', info.response);
                resolve(otp); // Trả về OTP để `userController` lưu vào database
            }
        });
    });
}

// quên mật khẩu
function sendNewPassword(email, newPassword) {
    const mailOptions = {
        from: '"MenT Perfume" <hoctrinhf04@gmail.com>',
        to: email,
        subject: 'Quên mật khẩu',
        text: `Mật khẩu mới của bạn là là: ${newPassword}`
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred while sending new password:', error);
                reject(error);
            } else {
                console.log('New password Email sent successfully:', info.response);
                resolve(newPassword); // Trả về newPassword để `userController` lưu vào database
            }
        });
    });
}

module.exports = {
    sendOTP,
    sendNewPassword
};
