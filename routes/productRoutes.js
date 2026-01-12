import express from 'express';
// Đảm bảo KHÔNG có dấu { } quanh ProductController
import ProductController from '../controllers/ProductController.js';

const router = express.Router();

// Public
router.get('/all', (req, res, next) => {
    console.log(">>> Postman đang gọi vào hàm getAll...");
    next();
}, ProductController.getAll);

router.get('/search', ProductController.search);
router.get('/category', ProductController.getByCategory);
router.get('/brand', ProductController.getByBrand);
router.get('/detail', ProductController.getDetail);

// Protected
router.post('/', ProductController.create);
router.put('/', ProductController.update);
router.delete('/', ProductController.delete);

export default router;