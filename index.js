import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Nếu có dùng cors

// 1. Import các route cũ
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
console.log("PRODUCT ROUTES LOADED");

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

app.use('/api/products', productRoutes);



// --- CẤU HÌNH CỔNG (PORT) 3001 ---
const PORT = process.env.PORT || 3001;

// ... các dòng app.use('/api/products', ...) ở trên

// Đặt route test ở ĐÂY (Trước app.listen)
app.get('/test-go', (req, res) => {
    res.send("Server hoàn toàn bình thường, lỗi nằm ở chỗ khác!");
});

// app.listen là dòng CUỐI CÙNG của file
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});