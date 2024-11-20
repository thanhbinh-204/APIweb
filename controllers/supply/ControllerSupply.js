const Supplier = require('./ModelSupply'); 

// lấy danh sách nhà cung cấp
const getSuppliers = async (page, limit, keyword) => {
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


        let Suppliers = Supplier
            .find(query)
            // Bỏ qua bao nhiêu sản phẩm
            .skip(skip)
            // Giới hạn số lượng sản phẩm 
            .limit(limit)
            // Sắp xếp theo thời gian tạo
            .sort(sort);

        return Suppliers;

    } catch (error) {
        console.log('Lấy danh sách voucher lỗi: ', error);
        throw new Error('Lấy danh sách voucher lỗi');
    }
}

// Thêm nhà cung cấp
const addSupplier = async (name) => {
    if (!name) {
        throw new Error('Tên nhà cung cấp là bắt buộc.');
    }

    const newSupplier = new Supplier({ name });
    return await newSupplier.save();
};

// Cập nhật nhà cung cấp
const updateSupplier = async (id, name) => {
    if (!name) {
        throw new Error('Tên nhà cung cấp là bắt buộc.');
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
        id,
        { name, update_at: Date.now() },
        { new: true }
    );

    if (!updatedSupplier) {
        throw new Error('Nhà cung cấp không tồn tại.');
    }

    return updatedSupplier;
};

// Xóa nhà cung cấp
const deleteSupplier = async (id) => {
    const deletedSupplier = await Supplier.findByIdAndDelete(id);

    if (!deletedSupplier) {
        throw new Error('Nhà cung cấp không tồn tại.');
    }

    return { message: 'Nhà cung cấp đã được xóa thành công.' };
};


module.exports = { addSupplier, updateSupplier, deleteSupplier, getSuppliers };
