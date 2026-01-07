import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// Định nghĩa route: POST /api/login
router.post('/login', userController.login);
router.post('/logout', userController.logout);//test
// test
export default router;