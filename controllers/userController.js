import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';


dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'mat_khau_bi_mat_cua_ban_123';

export default class userController {
    
    // --- HÀM LOGIN "LAI" (HYBRID) ---
    static async login(req, res) {
        try {
            const { username, password } = req.body; // password người dùng nhập (vd: "123456")

            // 1. Tìm user trong DB
            const user = await userModel.findByUsername(username);
            console.log("user tìm được:", user);
            
            if (!user) {
                return res.status(401).json({ succeeded: false, message: 'Tài khoản không tồn tại' });
            }

            // 2. Kiểm tra mật khẩu
            let isMatch = false;

            // Cách A: Thử so sánh Hash (Dành cho user mới đăng ký sau này)
            try {
                // Nếu user.password trong DB không phải hash bcrypt, hàm này sẽ trả false hoặc throw lỗi
                isMatch = await compare(password, user.password);
            } catch (e) {
                // Bỏ qua lỗi, chuyển sang cách B
            }

            // Cách B: Nếu so sánh Hash thất bại, kiểm tra so sánh thô (PLAIN TEXT)
            // Dành cho user cũ: AdminA (654321), KhachhangA (123456)
            if (!isMatch) {
                if (password === user.password) {
                    isMatch = true;
                }
            }

            if (!isMatch) {
                return res.status(401).json({ succeeded: false, message: 'Sai mật khẩu' });
            }

            // 3. Tạo Token
            const token = jwt.sign(
                { 
                    id: user.id,
                    username: user.username,
                    is_admin: user.is_admin
                }, 
                JWT_SECRET, 
                { expiresIn: '8h' }
            );

            // 4. Trả về kết quả
            res.status(200).json({ 
                succeeded: true, 
                message: "Đăng nhập thành công",
                token: token,
                is_admin: user.is_admin 
            });

        } catch (error) {
            console.error("Login Error:", error);
            res.status(500).json({ succeeded: false, message: 'Lỗi server' });
        }
    }

    // --- HÀM LOGOUT ---
    static async logout(req, res) {
        try {
            // Lấy token từ header (Bearer token)
            const authHeader = req.headers['authorization'];
            if (!authHeader) return res.status(200).json({ succeeded: true }); // Không có token coi như đã out

            const token = authHeader.split(' ')[1];
            if (!token) return res.status(200).json({ succeeded: true });

            const decoded = jwt.decode(token);
            // Tính thời gian hết hạn để lưu vào DB
            const exp = decoded && decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 8 * 3600000);
            
            await userModel.revokeToken(token, exp);
            res.status(200).json({ succeeded: true, message: 'Đăng xuất thành công' });
        } catch (error) {
            console.error("Logout Error:", error);
            res.status(500).json({ succeeded: false, message: 'Lỗi server khi đăng xuất' });
        }
    }
    // --- HÀM REGISTER ---
static async register(req, res) {
    try {
        const { username, password } = req.body;

        // 1. Validate
        if (!username || !password) {
            return res.status(400).json({
                succeeded: false,
                message: 'Thiếu username hoặc password'
            });
        }

        // 2. Kiểm tra trùng username
        const existingUser = await userModel.findByUsername(username);
        if (existingUser) {
            return res.json({
                succeeded: false,
                message: 'Username đã tồn tại'
            });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Tạo user mới (is_admin = 0)
        await userModel.create({
            username,
            password: hashedPassword,
            is_admin: 0
        });

        // 5. Trả kết quả
        return res.status(201).json({
            succeeded: true,
            message: 'Đăng ký thành công'
        });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            succeeded: false,
            message: 'Lỗi server'
        });
    }
}

}