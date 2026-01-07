import { execute } from '../config/db.js';

export default class userModel {
    // 1. Tìm user theo username
    static async findByUsername(username) {
        // Lưu ý: Cột trong SQL là "Username" (viết hoa chữ U)
        const [rows] = await execute(
            'SELECT * FROM users WHERE Username = ? AND deleted_at IS NULL LIMIT 1', 
            [username]
        );
        
        if (rows[0]) {
            return {
                ...rows[0],
                // Map lại tên field cho chuẩn với code JS hiện đại
                id: rows[0].id,
                username: rows[0].Username, 
                password: rows[0].Password, // Lấy mật khẩu gốc từ DB
                is_admin: rows[0].is_admin
            };
        }
        return null;
    }

    // 2. Tìm user theo ID (Dùng cho middleware xác thực sau này)
    static async findById(id) {
        const [rows] = await execute('SELECT * FROM users WHERE id = ?', [id]);
        if (rows[0]) {
             return {
                ...rows[0],
                username: rows[0].Username,
                password: rows[0].Password,
                is_admin: rows[0].is_admin
            };
        }
        return null;
    }

    // 3. Logout: Lưu token vào bảng blacklist
    static async revokeToken(token, expiresAt) {
        const [result] = await execute(
            'INSERT INTO revoked_tokens (token, exprires_at) VALUES (?, ?)', 
            [token, expiresAt]
        );
        return result.affectedRows > 0;
    }

    // 4. Kiểm tra token có bị logout chưa
    static async isTokenRevoked(token) {
        const [rows] = await execute(
            'SELECT id FROM revoked_tokens WHERE token = ? LIMIT 1', 
            [token]
        );
        return rows.length > 0;
    }
}