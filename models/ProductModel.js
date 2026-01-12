import db from '../config/db.js'; // hoặc cách import của bạn
console.log("PRODUCT ROUTES LOADED");

export default class productModel {

    /**
     * Lấy tất cả sản phẩm (có pagination)
     */
    static async getAll(page = 1, limit = 20) {
        try {
            const offset = (page - 1) * limit;
            const query = `
                SELECT * FROM products 
                WHERE Active = 1
                LIMIT ? OFFSET ?
            `;
            const [rows] = await db.query(query, [limit, offset]);
            return rows;
        } catch (error) {
            console.error("Error in getAll:", error);
            throw error;
        }
    }

    /**
     * Tìm kiếm sản phẩm theo từ khóa
     */
    static async search(keyword) {
        try {
            const query = `
                SELECT * FROM products 
                WHERE (Name LIKE ? OR Description LIKE ?) 
                AND Active = 1
            `;
            const searchTerm = `%${keyword}%`;
            const [rows] = await db.query(query, [searchTerm, searchTerm]);
            return rows;
        } catch (error) {
            console.error("Error in search:", error);
            throw error;
        }
    }

    /**
     * Lấy sản phẩm theo danh mục
     */
    static async getByCategory(categoryId) {
        try {
            const query = `
                SELECT * FROM products 
                WHERE Category_id = ? AND Active = 1
            `;
            const [rows] = await db.query(query, [categoryId]);
            return rows;
        } catch (error) {
            console.error("Error in getByCategory:", error);
            throw error;
        }
    }

    /**
     * Lấy sản phẩm theo thương hiệu
     */
    static async getByBrand(brandId) {
        try {
            const query = `
                SELECT * FROM products 
                WHERE Brand_id = ? AND Active = 1
            `;
            const [rows] = await db.query(query, [brandId]);
            return rows;
        } catch (error) {
            console.error("Error in getByBrand:", error);
            throw error;
        }
    }

    /**
     * Lấy chi tiết sản phẩm theo ID
     */
    static async getById(id) {
        try {
            const query = `
                SELECT * FROM products 
                WHERE id = ? AND Active = 1
            `;
            const [rows] = await db.query(query, [id]);
            return rows[0] || null;
        } catch (error) {
            console.error("Error in getById:", error);
            throw error;
        }
    }

    /**
     * Tạo sản phẩm (dành cho admin)
     */
    static async create(productData) {
        try {
            const {
                Name, Description, Original_Price, Quantity, 
                Image, Brand_id, Category_id, Discount_percent
            } = productData;

            const query = `
                INSERT INTO products 
                (Name, Description, Original_Price, Quantity, Image, Brand_id, Category_id, Discount_percent, Active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
            `;

            const [result] = await db.query(query, [
                Name, Description, Original_Price, Quantity, 
                Image, Brand_id, Category_id, Discount_percent
            ]);

            return result.insertId;
        } catch (error) {
            console.error("Error in create:", error);
            throw error;
        }
    }

    /**
     * Cập nhật sản phẩm (dành cho admin)
     */
    static async update(id, productData) {
        try {
            const {
                Name, Description, Original_Price, Quantity, 
                Image, Brand_id, Category_id, Discount_percent
            } = productData;

            const query = `
                UPDATE products 
                SET Name = ?, Description = ?, Original_Price = ?, Quantity = ?, 
                    Image = ?, Brand_id = ?, Category_id = ?, Discount_percent = ?
                WHERE id = ?
            `;

            const [result] = await db.query(query, [
                Name, Description, Original_Price, Quantity, 
                Image, Brand_id, Category_id, Discount_percent, id
            ]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error in update:", error);
            throw error;
        }
    }

    /**
     * Xóa sản phẩm (soft delete - đặt Active = 0)
     */
    static async delete(id) {
        try {
            const query = `
                UPDATE products 
                SET Active = 0
                WHERE id = ?
            `;

            const [result] = await db.query(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error in delete:", error);
            throw error;
        }
    }

    /**
     * Lấy tổng số sản phẩm
     */
    static async getTotalCount() {
        try {
            const query = `
                SELECT COUNT(*) as total FROM products 
                WHERE Active = 1
            `;
            const [rows] = await db.query(query);
            return rows[0].total;
        } catch (error) {
            console.error("Error in getTotalCount:", error);
            throw error;
        }
    }
}