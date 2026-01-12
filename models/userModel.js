import { execute } from '../config/db.js';

export default class userModel {
    // 1. Tìm user theo username
    static async findByUsername(username) {
        console.log("userModel.findByUsername:", username);
        try {
            const [rows] = await execute(
                'SELECT * FROM users WHERE Username = ? LIMIT 1', // bỏ deleted_at nếu bảng chưa có cột
                [username]
            );
            console.log("Rows trả về:", rows);
            
            if (rows[0]) {
                return {
                    ...rows[0],
                    id: rows[0].id,
                    username: rows[0].Username,
                    password: rows[0].Password,
                    is_admin: rows[0].is_admin
                };
            }
            return null;
        } catch (err) {
            console.error("Error in findByUsername:", err);
            throw err; // đẩy lỗi lên controller
        }
    }

    // 2. Tìm user theo ID
    static async findById(id) {
        try {
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
        } catch (err) {
            console.error("Error in findById:", err);
            throw err;
        }
    }
    static async findByEmail(email) {
        // Lưu ý: chữ 'email' trong câu lệnh SQL phải khớp với tên cột trong Database của bạn
        const [rows] = await execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0]; 
    }
    // 3. Tạo user mới (Register), email
    static async create({ username, password, is_admin, email }) {
    try {
        // Thứ tự cột và thứ tự biến trong mảng [ ] phải khớp nhau 100%
        const [result] = await execute(
            'INSERT INTO users (Username, Password, is_admin, email) VALUES (?, ?, ?, ?)',
            [username, password, is_admin, email]
        );
        return result.affectedRows > 0;
    } catch (err) {
        console.error("SQL Error tại create:", err);
        throw err;
    }

}

static async updatePasswordByEmail(email, password) {
    const [result] = await execute(
        'UPDATE users SET Password = ? WHERE Email = ?',
        [password, email]
    );
    return result.affectedRows > 0;
}

}
