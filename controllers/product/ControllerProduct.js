const ModelProduct = require('./ModelProduct');
const ModelCategory = require('../categories/ModelCategory');
const ModelSupply = require('../supply/ModelSupply');
const mongoose = require('mongoose');
const ModelCart = require('../carts/ModelCart');




// page: trang hiện tại
// limit: số lượng sản phẩm trên 1 trang
// keyword: từ khóa tìm kiếm
const getAll = async (page, limit, keyword = '') => {
    try {
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        let query = {};
        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' }; // Tìm theo tên sản phẩm
        }

        const products = await ModelProduct.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ create_at: -1 });

        return products;
    } catch (error) {
        console.error('Lấy tất cả sản phẩm lỗi: ', error);
        throw new Error('Lấy tất cả sản phẩm lỗi');
    }
};

// Thêm sản phẩm
const insertDB = async (name, price, quantity, images, description, category, supplier) => {
    try {
        // Kiểm tra danh mục có tồn tại không
        const categoryDB = await ModelCategory.findById(category);
        if (!categoryDB) {
            throw new Error('Danh mục không tồn tại');
        }

        // Kiểm tra nhà cung cấp có tồn tại không
        const supplierDB = await ModelSupply.findById(supplier);
        if (!supplierDB) {
            throw new Error('Nhà cung cấp không tồn tại');
        }

        const product = new ModelProduct({
            name,
            price,
            quantity,
            images: images,
            description,
            category: {
                category_id: categoryDB._id,
                category_name: categoryDB.name,
                category_brand: categoryDB.brand
            },
            supplier: {
                supply_id: supplierDB._id,
                supply_name: supplierDB.name,
            },
        });

        let result = await product.save();
        return result;
    } catch (error) {
        console.error('Thêm sản phẩm lỗi: ', error);
        throw new Error('Thêm sản phẩm lỗi');
    }
};

// Cập nhật sản phẩm theo id
const updateDB = async (id, updateData) => {
    try {
        // Kiểm tra danh mục có tồn tại không
        const categoryDB = await ModelCategory.findById(updateData.category_id);
        if (!categoryDB) {
            throw new Error('Danh mục không tồn tại');
        }

        const supplierDB = await ModelSupply.findById(updateData.supply_id);
        if (!supplierDB) {
            throw new Error('Nhà cung cấp không tồn tại');
        }

        const product = await ModelProduct.findByIdAndUpdate(
            id,
            {
                $set: {
                    name: updateData.name,
                    price: updateData.price,
                    quantity: updateData.quantity,
                    images: updateData.images,
                    description: updateData.description,
                    discount: updateData.discount,
                    status: updateData.status,
                    category: {
                        category_id: categoryDB._id,
                        category_name: categoryDB.name,
                        category_brand: categoryDB.brand
                    },
                    supplier: {
                        supply_id: supplierDB._id,
                        supply_name: supplierDB.name,
                    }
                }
            },
            { new: true }
        );

        return product;
    } catch (error) {
        console.error('Cập nhật sản phẩm lỗi: ', error);
        throw new Error('Cập nhật sản phẩm lỗi');
    }
};


// Tìm sản phẩm theo tên
const findProduct = async (name) => {
    try {
        if (name) {
            const productDB = await ModelProduct.find({ name: { $regex: name, $options: 'i' } });
            return productDB;
        } else {
            throw new Error('Tên sản phẩm không được để trống');
        }
    } catch (error) {
        console.error('Tìm kiếm sản phẩm lỗi: ', error);
        throw new Error('Tìm kiếm sản phẩm lỗi');
    }
};

// Tìm sản phẩm theo id
const getProductID = async (id) => {
    try {
        const productDB = await ModelProduct.findById(id);
        if (!productDB) {
            throw new Error('Sản phẩm không tồn tại');
        }
        return productDB;
    } catch (error) {
        console.error('Tìm sản phẩm theo ID lỗi: ', error);
        throw new Error('Tìm sản phẩm theo ID lỗi');
    }
};

const findProductByCategory = async (categoryId) => {
    try {
        // Chuyển đổi categoryId thành ObjectId
        const categoryObjectId = new mongoose.Types.ObjectId(categoryId);

        // Kiểm tra danh mục tồn tại
        const cateDB = await ModelCategory.findById(categoryObjectId);
        if (!cateDB) {
            throw new Error('ID danh mục không tồn tại');
        }

        // Thực hiện tìm kiếm sản phẩm
        const products = await ModelProduct.find({ 'category.category_id': categoryObjectId });
        return products;
    } catch (error) {
        console.error('Tìm sản phẩm theo danh mục lỗi:', error.message);
        throw new Error('Tìm sản phẩm theo danh mục lỗi');
    }
};

// Xóa sản phẩm
const remove = async (id) => {
    try {
        const productDB = await ModelProduct.findById(id);
        if (!productDB) {
            throw new Error('Sản phẩm không tồn tại');
        }

        const isReferencedInOrders = await ModelCart.exists({ 'products._id': id });
        if (isReferencedInOrders) {
            throw new Error('Không thể xóa sản phẩm vì nó đang được sử dụng trong đơn hàng');
        }

        let result = await ModelProduct.findByIdAndDelete(id);
        return result;
    } catch (error) {
        console.error('Xóa sản phẩm lỗi: ', error);
        throw new Error('Xóa sản phẩm lỗi');
    }
};

// Lấy sản phẩm tốt nhất (theo quantity)
const getBestProduct = async () => {
    try {
        const products = await ModelProduct.find({}, 'name price quantity')
            .sort({ quantity: -1 }) // Giảm dần
            .limit(10);
        return products;
    } catch (error) {
        console.error('Lấy sản phẩm tốt nhất lỗi', error);
        throw new Error('Lấy sản phẩm tốt nhất lỗi');
    }
};



// Thêm dữ kiêu tàm thời để test
const insertData = async () => {
    try {

        // lấy danh mục
        const categories = await ModelCategory.find();
        const suppliers = await ModelSupply.find();
        for (let index = 0; index < 20; index++) {
            // lấy ngẫu nhiên 1 danh mục
            const category = categories[Math.floor(Math.random() * categories.length)];
            const supply = suppliers[Math.floor(Math.random() * suppliers.length)];


            const product = new ModelProduct({
                name: `Product ${index}`,
                price: 1000 * index,
                quantity: 100 * index,
                images: ['https://i.pinimg.com/236x/99/75/b5/9975b5b8d819d8cf9a523fcad48bbbb0.jpg'],
                description: `Description ${index}`,
                category: {
                    category_id: category._id,
                    category_name: category.name,
                    category_brand: category.brand
                },
                supplier: {
                    supply_id: supply._id,
                    supply_name: supply.name
                }
            });
            await product.save();
        }
    } catch (error) {
        console.error("Lỗi trong hàm insertData:", error);
    }
}


module.exports = { getAll, insertData, insertDB, updateDB, remove, findProduct, getProductID, getBestProduct, findProductByCategory };