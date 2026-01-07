// // ...existing code...
// import express from 'express';
// import * as orderController from '../controllers/orderController.js';

// const router = express.Router();

// router.get('/all', orderController.getAll);

// // THÊM DÒNG NÀY:
// router.get('/detail/:id', orderController.getDetail); 

// export default router;
// // ...existing code...
import express from 'express';
import orderController from '../controllers/orderController.js';

const router = express.Router();
console.log("--> Android gọi: orderRoutes.js");

// Định nghĩa route: POST /api/login
router.post('/all', orderController.getAll);
router.post('/detail', orderController.getDetail);

export default router;