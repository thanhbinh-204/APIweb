const Voucher = require('../voucher/ModelVoucher');
const UserModel = require('../user/userModel');
const ModelVoucher = require('../voucher/ModelVoucher');
const ModelCart = require('../carts/ModelCart')
const mongoose = require('mongoose');

const getallVoucher = async function (page, limit, keyword) {
    try {
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        let skip = (page - 1) * limit;
        let sort = { create_at: -1 };// 1: tăng dần, -1: giảm dần
        // query : điều kiện tìm kiếm
        let query = {};// nếu là 1 object rõng là không có điều kiện tìm kiếm
        query = {
            ...query,

        }

        let vouchers = ModelVoucher
            .find(query)
            // Bỏ qua bao nhiêu sản phẩm
            .skip(skip)
            // Giới hạn số lượng sản phẩm 
            .limit(limit)
            // Sắp xếp theo thời gian tạo
            .sort(sort);

        return vouchers;

    } catch (error) {
        console.log('Lấy danh sách nhà cung cấp lỗi: ', error);
        throw new Error('Lấy danh sách nhà cung cấp lỗi');
    }
}

const createVoucher = async (code, description, discountValue, minimumOrder, usageLimit, startDate, endDate) => {
    // Kiểm tra xem code đã tồn tại chưa
    const existingVoucher = await Voucher.findOne({ code });
    if (existingVoucher) {
        throw new Error('Voucher code đã tồn tại.');
    }

    // Tạo voucher mới
    const newVoucher = new Voucher({
        code,
        description,
        discountValue,
        minimumOrder,
        usageLimit,
        startDate,
        endDate,
        status: 'active'
    });

    await newVoucher.save();
    return { message: 'Tạo Voucher thành công', voucher: newVoucher };
};

const updateVoucher = async (idVoucher, updateData) => {
    try {
        const voucherInDB = await ModelVoucher.findByIdAndUpdate(
            idVoucher,
            { 
                $set: {
                    code: updateData.code,
                    description: updateData.description,
                    discountValue: updateData.discountValue,
                    minimizeOrder: updateData.minimumOrder,
                    usageLimit: updateData.usageLimit,
                    startDate: updateData.startDate,
                    endDate: updateData.endDate,
                    updatedAt: new Date,
                }
            },
            { new: true }
        );
        return voucherInDB;
    } catch (error) {
        console.log(error);
        throw new Error('Cập nhật voucher lỗi');
    }
}

const claimVoucher = async (user, voucherCode) => {
    try {
        const userInDB = await UserModel.findById(user);
        if (!userInDB) {
            throw new Error('Người dùng không tồn tại');
        }
        

        // Tìm voucher theo code
        const voucher = await Voucher.findOne({ code: voucherCode });
        if (!voucher) {
            throw new Error('Voucher không tìm thấy.');
        }

        // Kiểm tra nếu người dùng đã có voucher này
        if (userInDB.vouchers && userInDB.vouchers.some(v => v.voucherId.toString() === voucher._id.toString())) {
            throw new Error('Người dùng đã lấy Voucher này rồi.');
        }

        const currentDate = new Date();
        if (currentDate < voucher.startDate || currentDate > voucher.endDate || voucher.status !== 'active') {
            throw new Error('Voucher không có hiệu lực hoặc đã hết hạn.');
        }

        if (voucher.usageLimit <= voucher.usedCount) {
            throw new Error('Voucher đã đến giới hạn sử dụng.');
        }

        // Thêm voucher vào danh sách của người dùng và tăng số lượng sử dụng
        if (!userInDB.vouchers) userInDB.vouchers = []; // Đảm bảo vouchers là mảng
        userInDB.vouchers.push({ voucherId: voucher._id, VoucherCode: voucher.code });
        await userInDB.save();

        await voucher.save();

        return { message: 'Voucher claimed successfully', voucher };
    } catch (error) {
        console.log('Claim Voucher Error:', error.message);
        throw new Error(error.message);
    }
};

const useVoucher = async ( user, voucherCode ) => {
    try {
        const userId = await UserModel.findById(user); 
    if (!userId) {
        throw new Error('Người dùng không tồn tại.');
    }

    const voucher = await Voucher.findOne({ code: voucherCode });
    if (!voucher) {
        throw new Error('Voucher không tìm thấy.');
    }

    if (!userId.vouchers.includes(voucher._id.toString())) {
        throw new Error('Người dùng chưa sở hữu Voucher này.');
    }

    const currentDate = new Date();
    if (currentDate < voucher.startDate || currentDate > voucher.endDate || voucher.status !== 'active') {
        throw new Error('Voucher không có hiệu lực hoặc đã hết hạn.');
    }

    if (voucher.usageLimit <= voucher.usedCount) {
        throw new Error('Voucher đã hết số lần sử dụng.');
    }

    // Xóa voucher khỏi danh sách của người dùng
    userId.vouchers = userId.vouchers.filter(id => id.toString() !== voucher._id.toString());

    // Cập nhật số lần sử dụng voucher
    voucher.usedCount += 1;

    // Lưu thay đổi cho người dùng và voucher
    await Promise.all([userId.save(), voucher.save()]);

    return { message: 'Voucher đã được sử dụng và xóa khỏi danh sách của người dùng thành công', voucher }; 
    } catch (error) {
        console.log('Dùng voucher thất bại', error);
        throw new Error('Dùng voucher thất bại');   
    }   
};

const deleteVoucher = async (idVoucher) => {
    try {
        let IDvoucher = ModelVoucher.findById(idVoucher);
        if (!IDvoucher) {
            throw new Error('Không tìm thấy voucher');
        }
        
        const VoucherObjectId = new mongoose.Types.ObjectId(idVoucher);
        const isReferencedInUser = await UserModel.exists(VoucherObjectId);
        const isReferencedInOrder = await ModelCart.exists(VoucherObjectId);
        if(isReferencedInUser || isReferencedInOrder){
            throw new Error('Không thể xóa Voucher vì nó đang được sử dụng.');
        }

        const deleteVoucher = await ModelVoucher.findByIdAndDelete(VoucherObjectId);
        
        return { message: 'Nhà cung cấp đã được xóa thành công.', deleteVoucher};
    } catch (error) {
        console.log('Xóa voucher thất bại', error);
        throw new Error('Xóa voucher thất bại');  
    }
}

module.exports = { createVoucher, claimVoucher, useVoucher, deleteVoucher, getallVoucher, updateVoucher };
