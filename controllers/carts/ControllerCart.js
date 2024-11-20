const ModelCart = require('./ModelCart');
const UserModal = require('../user/userModel');
const ModelProduct = require('../product/ModelProduct');



const addCart = async (user, products) => {
    try {
        const userInDB = await UserModal.findById(user);
        if (!userInDB) {
            throw new Error('Người dùng không tồn tại');
        }

        if (!Array.isArray(products)) {
            throw new Error('Sản phẩm phải là mảng');
        }

        let productsInCart = [];
        let total = 0;
        for (let item of products) {
            const product = await ModelProduct.findById(item._id);
            if (!product) {
                throw new Error('Sản phẩm không tồn tại');
            }
            if (item.quantity > product.quantity) {
                throw new Error('Sản phẩm hết hàng');
            }

            const productItem = {
                _id: product._id,
                image: product.images?.[0],
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            };
            productsInCart.push(productItem);
            total += product.price * item.quantity;
        }

        const cart = new ModelCart({
            user: { _id: userInDB._id, name: userInDB.username }, // Truyền thêm tên người dùng
            products: productsInCart,
            total,
        });

        const savedCart = await cart.save();

        await UserModal.findByIdAndUpdate(
            userInDB._id,
            { $push: { carts: savedCart._id } },
            { new: true }
        );

        // Sử dụng setTimeout để cập nhật số lượng sản phẩm
        setTimeout(async () => {
            for (let item of products) {
                const product = await ModelProduct.findById(item._id);
                if (product) {
                    product.quantity -= item.quantity;
                    await product.save();
                }
            }
        }, 0);

        return {
            status: true,
            message: "Mua sản phẩm thành công.",
            feedback: savedCart,
        };

    } catch (error) {
        console.log(error);
        throw new Error('Thêm vào giỏ hàng thất bại');
    }
};


const getAllCarts = async () => {
    try {
        const carts = await ModelCart.find().sort({ date: -1 });
        return carts;
    } catch (error) {
        console.error('Lỗi khi lấy tất cả giỏ hàng:', error.message);
        throw new Error('Lỗi khi lấy tất cả giỏ hàng');
    }
};

const getCartsByUserId = async (userId) => {
    try {
        const carts = await ModelCart.find({ 'user._id': userId }).sort({ date: -1 });
        return carts;
    } catch (error) {
        console.error('Lỗi khi tìm giỏ hàng theo ID người dùng:', error.message);
        throw new Error('Lỗi khi tìm giỏ hàng theo ID người dùng');
    }
};

const updateStatus = async (idCart, updateData) => {
    try {
        const cartInDB = await ModelCart.findByIdAndUpdate(
            idCart,
            { $set: updateData },
            { new: true }
        );
        return cartInDB;
    } catch (error) {
        console.log(error);
        throw new Error('Cập nhật tình trạng đơn hàng lỗi');
    }
};

module.exports = { addCart, getCartsByUserId, updateStatus, getAllCarts };
