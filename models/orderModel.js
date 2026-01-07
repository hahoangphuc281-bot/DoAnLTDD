import { execute } from '../config/db.js';

export default class orderModel {
    // ... (Giữ nguyên hàm getAllOrders cũ)
    static async getAllOrders() {
        // Câu lệnh lấy tất cả đơn hàng từ bảng orders
        // Nếu database của bạn tên cột khác order_date, hãy sửa lại (vd: date)
        const sql = 'SELECT * FROM orders ORDER BY order_date DESC';
        
        try {
            const [rows] = await execute(sql);
            console.log("--> Lấy tất cả đơn hàng:", rows);
            
            return rows;
        } catch (error) {
            console.error("Lỗi SQL (getAllOrders):", error);
            throw error;
        }
    }

    // HÀM MỚI: Lấy thông tin chi tiết đơn hàng + sản phẩm
    static async getOrderDetail(orderId) {
        // 1. Lấy thông tin chung đơn hàng
        const sqlOrder = `
            SELECT o.order_id, u.Username, o.status, o.order_date, o.total_amount, o.shipping_address
            FROM orders o
            INNER JOIN users u ON o.user_id = u.id
            WHERE o.order_id = ?
        `;
        const [orderRows] = await execute(sqlOrder, [orderId]);
        
        if (orderRows.length === 0) return null;
        const orderInfo = orderRows[0];

        // 2. Lấy danh sách sản phẩm trong đơn đó
        const sqlProducts = `
            SELECT p.Name, p.Image, od.quantity, od.price_at_purchase
            FROM order_details od
            INNER JOIN products p ON od.product_id = p.id
            WHERE od.order_id = ?
        `;
        const [productRows] = await execute(sqlProducts, [orderId]);

        // 3. Ghép lại thành 1 object hoàn chỉnh
        return {
            ...orderInfo,
            products: productRows
        };
    }
}