// Import biến pool từ file db.js
// File: server_api/models/orderModel.js
import pool from '../config/db.js';

export default class orderModel {

    // --- SỬA HÀM NÀY ---
    static async getAllOrders() {
        // Cũ: SELECT * FROM orders... (Thiếu Username)
        // Mới: JOIN với bảng users để lấy Username
        const sql = `
            SELECT o.*, u.Username 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            ORDER BY o.order_date DESC
        `;
        
        try {
            const [rows] = await pool.execute(sql);
            return rows;
        } catch (error) {
            console.error("Lỗi SQL (getAllOrders):", error);
            throw error;
        }
    }

static async updateStatus(orderId, newStatus) {
        // Câu lệnh SQL cập nhật trạng thái
        const sql = 'UPDATE orders SET status = ? WHERE order_id = ?';
        try {
            await pool.execute(sql, [newStatus, orderId]);
            return true;
        } catch (error) {
            console.error("Lỗi SQL updateStatus:", error);
            throw error;
        }
    }

    // 2. Hàm lấy chi tiết đơn hàng
    static async getOrderDetail(orderId) {
        try {
            // Lấy thông tin chung
            const sqlOrder = `
                SELECT o.order_id, u.Username, o.status, o.order_date, o.total_amount, o.shipping_address
                FROM orders o
                INNER JOIN users u ON o.user_id = u.id
                WHERE o.order_id = ?
            `;
            const [orderRows] = await pool.execute(sqlOrder, [orderId]);
            
            if (orderRows.length === 0) return null;
            
            // Lấy danh sách sản phẩm
            const sqlProducts = `
                SELECT p.Name, p.Image, od.quantity, od.price_at_purchase
                FROM order_details od
                INNER JOIN products p ON od.product_id = p.id
                WHERE od.order_id = ?
            `;
            const [productRows] = await pool.execute(sqlProducts, [orderId]);

            // Ghép dữ liệu
            return {
                ...orderRows[0],
                products: productRows
            };
        } catch (error) {
            console.error("Lỗi SQL (getOrderDetail):", error);
            throw error;
        }
    }
}