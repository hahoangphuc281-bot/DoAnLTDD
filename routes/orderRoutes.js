import express from 'express';
import orderController from '../controllers/orderController.js';

const router = express.Router();

// Định nghĩa GET
router.get('/all', orderController.getAll);
router.get('/detail/:id', orderController.getDetail); 
router.post('/update-status', orderController.updateStatus);

export default router;