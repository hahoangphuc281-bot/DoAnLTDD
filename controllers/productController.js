import ProductModel from '../models/productModel.js';

export default class ProductController {
    
    // API: GET /api/products (Code cũ)
    static async getAllProducts(req, res) {
        try {
            const products = await ProductModel.getAll();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server" });
        }
    }

    // API: GET /api/products/detail/:id (MỚI)
    static async getProductDetail(req, res) {
        try {
            const productId = req.params.id;

            // Chạy 2 lệnh song song lấy Product và Reviews
            const [product, reviews] = await Promise.all([
                ProductModel.getById(productId),
                ProductModel.getReviews(productId)
            ]);

            if (!product) {
                return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            }

            // Trả về đúng format Android cần
            res.status(200).json({
                product: product,
                reviews: reviews || []
            });

        } catch (error) {
            console.error("Lỗi detail:", error);
            res.status(500).json({ message: "Lỗi server khi lấy chi tiết" });
        }
    }
}