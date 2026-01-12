
import productModel from '../models/ProductModel.js';
console.log("PRODUCT ROUTES LOADED");
export default class ProductController {

    /**
     * Lấy tất cả sản phẩm
     * Query: GET /api/products?page=1&limit=20
     */
    static async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            // Validate
            if (page < 1 || limit < 1) {
                return res.status(400).json({
                    succeeded: false,
                    data: null,
                    message: 'Page và limit phải lớn hơn 0'
                });
            }

            const products = await productModel.getAll(page, limit);
            const total = await productModel.getTotalCount();

            res.status(200).json({
                succeeded: true,
                data: products,
                message: 'Lấy sản phẩm thành công',
                total: total,
                page: page,
                limit: limit
            });

        } catch (error) {
            console.error("Error in getAll:", error);
            res.status(500).json({
                succeeded: false,
                data: null,
                message: 'Lỗi server'
            });
        }
    }

    /**
     * Tìm kiếm sản phẩm
     * Query: GET /api/products/search?keyword=chanel
     */
    static async search(req, res) {
        try {
            const { keyword } = req.query;

            if (!keyword || keyword.trim() === '') {
                return res.status(400).json({
                    succeeded: false,
                    data: null,
                    message: 'Vui lòng nhập từ khóa tìm kiếm'
                });
            }

            const products = await productModel.search(keyword);

            res.status(200).json({
                succeeded: true,
                data: products,
                message: `Tìm kiếm "${keyword}" thành công`
            });

        } catch (error) {
            console.error("Error in search:", error);
            res.status(500).json({
                succeeded: false,
                data: null,
                message: 'Lỗi server'
            });
        }
    }

    /**
     * Lấy sản phẩm theo danh mục
     * Query: GET /api/products/category?category_id=1
     */
    static async getByCategory(req, res) {
        try {
            const { category_id } = req.query;

            if (!category_id) {
                return res.status(400).json({
                    succeeded: false,
                    data: null,
                    message: 'Vui lòng cung cấp category_id'
                });
            }

            const products = await productModel.getByCategory(category_id);

            res.status(200).json({
                succeeded: true,
                data: products,
                message: 'Lấy sản phẩm theo danh mục thành công'
            });

        } catch (error) {
            console.error("Error in getByCategory:", error);
            res.status(500).json({
                succeeded: false,
                data: null,
                message: 'Lỗi server'
            });
        }
    }

    /**
     * Lấy sản phẩm theo thương hiệu
     * Query: GET /api/products/brand?brand_id=1
     */
    static async getByBrand(req, res) {
        try {
            const { brand_id } = req.query;

            if (!brand_id) {
                return res.status(400).json({
                    succeeded: false,
                    data: null,
                    message: 'Vui lòng cung cấp brand_id'
                });
            }

            const products = await productModel.getByBrand(brand_id);

            res.status(200).json({
                succeeded: true,
                data: products,
                message: 'Lấy sản phẩm theo thương hiệu thành công'
            });

        } catch (error) {
            console.error("Error in getByBrand:", error);
            res.status(500).json({
                succeeded: false,
                data: null,
                message: 'Lỗi server'
            });
        }
    }

    /**
     * Lấy chi tiết sản phẩm
     * Query: GET /api/products/detail?id=1
     */
    static async getDetail(req, res) {
        try {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({
                    succeeded: false,
                    data: null,
                    message: 'Vui lòng cung cấp id sản phẩm'
                });
            }

            const product = await productModel.getById(id);

            if (!product) {
                return res.status(404).json({
                    succeeded: false,
                    data: null,
                    message: 'Sản phẩm không tồn tại'
                });
            }

            res.status(200).json({
                succeeded: true,
                data: [product],
                message: 'Lấy chi tiết sản phẩm thành công'
            });

        } catch (error) {
            console.error("Error in getDetail:", error);
            res.status(500).json({
                succeeded: false,
                data: null,
                message: 'Lỗi server'
            });
        }
    }

    /**
     * Tạo sản phẩm (admin only)
     * POST /api/products
     */
    static async create(req, res) {
        try {
            // Check admin
            if (req.user.is_admin !== 1) {
                return res.status(403).json({
                    succeeded: false,
                    data: null,
                    message: 'Chỉ admin mới có quyền tạo sản phẩm'
                });
            }

            const { Name, Description, Original_Price, Quantity, Image, Brand_id, Category_id, Discount_percent } = req.body;

            // Validate
            if (!Name || !Original_Price || !Brand_id || !Category_id) {
                return res.status(400).json({
                    succeeded: false,
                    data: null,
                    message: 'Thiếu thông tin bắt buộc'
                });
            }

            const productId = await productModel.create({
                Name, Description, Original_Price, Quantity: Quantity || 0,
                Image: Image || '', Brand_id, Category_id, Discount_percent: Discount_percent || 0
            });

            res.status(201).json({
                succeeded: true,
                data: { id: productId },
                message: 'Tạo sản phẩm thành công'
            });

        } catch (error) {
            console.error("Error in create:", error);
            res.status(500).json({
                succeeded: false,
                data: null,
                message: 'Lỗi server'
            });
        }
    }

    /**
     * Cập nhật sản phẩm (admin only)
     * PUT /api/products?id=1
     */
    static async update(req, res) {
        try {
            // Check admin
            if (req.user.is_admin !== 1) {
                return res.status(403).json({
                    succeeded: false,
                    data: null,
                    message: 'Chỉ admin mới có quyền cập nhật sản phẩm'
                });
            }

            const { id } = req.query;
            if (!id) {
                return res.status(400).json({
                    succeeded: false,
                    data: null,
                    message: 'Vui lòng cung cấp id sản phẩm'
                });
            }

            const updated = await productModel.update(id, req.body);

            if (!updated) {
                return res.status(404).json({
                    succeeded: false,
                    data: null,
                    message: 'Sản phẩm không tồn tại'
                });
            }

            res.status(200).json({
                succeeded: true,
                data: null,
                message: 'Cập nhật sản phẩm thành công'
            });

        } catch (error) {
            console.error("Error in update:", error);
            res.status(500).json({
                succeeded: false,
                data: null,
                message: 'Lỗi server'
            });
        }
    }

    /**
     * Xóa sản phẩm (admin only)
     * DELETE /api/products?id=1
     */
    static async delete(req, res) {
        try {
            // Check admin
            if (req.user.is_admin !== 1) {
                return res.status(403).json({
                    succeeded: false,
                    data: null,
                    message: 'Chỉ admin mới có quyền xóa sản phẩm'
                });
            }

            const { id } = req.query;
            if (!id) {
                return res.status(400).json({
                    succeeded: false,
                    data: null,
                    message: 'Vui lòng cung cấp id sản phẩm'
                });
            }

            const deleted = await productModel.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    succeeded: false,
                    data: null,
                    message: 'Sản phẩm không tồn tại'
                });
            }

            res.status(200).json({
                succeeded: true,
                data: null,
                message: 'Xóa sản phẩm thành công'
            });

        } catch (error) {
            console.error("Error in delete:", error);
            res.status(500).json({
                succeeded: false,
                data: null,
                message: 'Lỗi server'
            });
        }
    }
}