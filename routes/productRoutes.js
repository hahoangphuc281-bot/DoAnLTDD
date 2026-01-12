// File: routes/productRoutes.js
import express from 'express';
import ProductController from '../controllers/productController.js';

const router = express.Router();

// Route lấy danh sách: http://localhost:3001/api/products
router.get('/', ProductController.getAllProducts);

// Route lấy chi tiết + đánh giá (MỚI THÊM)
// Gọi kiểu: http://localhost:3001/api/products/detail/1
router.get('/detail/:id', ProductController.getProductDetail);

export default router;