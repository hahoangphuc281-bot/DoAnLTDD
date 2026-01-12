import express from 'express';
import ProductController from '../controllers/productController.js';

const router = express.Router();

// Route cũ
router.get('/', ProductController.getAllProducts);

// Route MỚI: lấy chi tiết
router.get('/detail/:id', ProductController.getProductDetail);

export default router;