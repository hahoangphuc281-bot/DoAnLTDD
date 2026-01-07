import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '', // Mật khẩu MySQL của bạn (thường là rỗng trên XAMPP)
    database: process.env.DB_NAME || 'nuochoa',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Hàm execute helper để chạy câu lệnh SQL gọn hơn
export const execute = async (sql, params) => {
    try {
        const [rows, fields] = await pool.execute(sql, params);
        return [rows, fields];
    } catch (error) {
        console.error("Database Error:", error);
        throw error;
    }
};

export default pool;