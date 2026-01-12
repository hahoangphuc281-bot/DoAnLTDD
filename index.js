import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Nếu có dùng cors

// 1. Import các route cũ
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// --- QUAN TRỌNG: Import route sản phẩm mới tạo ---
import productRoutes from './routes/productRoutes.js'; 
// ------------------------------------------------

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Cấu hình cors nếu cần

// 2. Đăng ký các route
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// --- QUAN TRỌNG: Đăng ký đường dẫn cho sản phẩm ---
// Khi người dùng vào /api/products -> nó sẽ chạy vào productRoutes
app.use('/api/products', productRoutes);
// -------------------------------------------------

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});