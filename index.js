import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import các file route đã tạo
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();

// Middleware xử lý JSON và CORS
app.use(express.json());
app.use(cors());

// --- ĐĂNG KÝ CÁC ROUTE API ---

// 1. Route cho User (Login, Logout)
// URL: http://localhost:3001/api/users/login
app.use('/api/users', userRoutes);

// 2. Route cho Order (Lấy danh sách đơn hàng) test
// URL: http://localhost:3001/api/orders/all
app.use('/api/orders', orderRoutes);

// --- CẤU HÌNH CỔNG (PORT) 3001 ---
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});