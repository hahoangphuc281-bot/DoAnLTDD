import { execute } from '../config/db.js';

export default class ProductModel {
    // 1. Lấy tất cả (Code cũ)
    static async getAll() {
        const sql = `SELECT p.*, b.Name AS brand_name FROM products p LEFT JOIN brand b ON p.Brand_id = b.id WHERE p.Active = 1`;
        const [rows] = await execute(sql);
        return rows;
    }

    // 2. Lấy chi tiết 1 sản phẩm (MỚI)
    static async getById(productId) {
        const sql = `
            SELECT p.*, b.Name AS brand_name 
            FROM products p
            LEFT JOIN brand b ON p.Brand_id = b.id
            WHERE p.id = ?
        `;
        const [rows] = await execute(sql, [productId]);
        return rows[0]; 
    }

    // 3. Lấy đánh giá (MỚI)
    static async getReviews(productId) {
        // Lưu ý: Oder_id viết thiếu chữ r giống database của bạn
        const sql = `
            SELECT 
                r.review_id, r.rating, r.comment, r.created_at, 
                u.Username as userName
            FROM reviews r
            JOIN orders o ON r.Oder_id = o.order_id
            JOIN users u ON o.user_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
        `;
        const [rows] = await execute(sql, [productId]);
        return rows;
    }
}