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
    // LỆNH MẤU CHỐT 1: Xem Server thực sự nhận được gì từ Postman/Android
    console.log("--- Dữ liệu Body nhận được: ---", req.body);

    try {
        const { username, email, password } = req.body;

        // LỆNH MẤU CHỐT 2: Kiểm tra nghiêm ngặt
        // Nếu không có email, hoặc email chỉ toàn dấu cách, sẽ bị chặn ngay
        if (!username || !email || email.trim() === "" || !password) {
            console.log("=> Thất bại: Thiếu thông tin bắt buộc");
            return res.status(400).json({
                succeeded: false,
                message: 'Vui lòng nhập đầy đủ Username, Email và Password'
            });
        }

        // 3a. Kiểm tra trùng Username
        const existingUser = await userModel.findByUsername(username);
        if (existingUser) {
            return res.status(200).json({ // Dùng 200 để App dễ xử lý logic
                succeeded: false,
                message: 'Username đã tồn tại'
            });
        }

        // 3b. Kiểm tra trùng Email
        // Lưu ý: Đảm bảo bạn đã viết hàm findByEmail trong userModel.js
        const existingEmail = await userModel.findByEmail(email);
        if (existingEmail) {
            return res.status(200).json({
                succeeded: false,
                message: 'Email này đã được sử dụng'
            });
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Tạo user mới
        console.log("=> Đang chuẩn bị INSERT vào DB với email:", email);
        const result = await userModel.create({
            username,
            email,
            password: hashedPassword,
            is_admin: 0
        });

        // 6. Trả kết quả
        return res.status(201).json({
            succeeded: true,
            message: 'Đăng ký thành công'
        });

    } catch (error) {
        console.error("Lỗi đăng ký tại Controller:", error);
        return res.status(500).json({
            succeeded: false,
            message: 'Lỗi server nội bộ'
        });
    }
}
static async changePassword(req, res) {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                succeeded: false,
                message: 'Thiếu dữ liệu'
            });
        }

        // 1. Tìm user theo email
        const user = await userModel.findByEmail(email);
        if (!user) {
            return res.status(404).json({
                succeeded: false,
                message: 'Email không tồn tại'
            });
        }

        // 2. Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 3. Update mật khẩu
        await userModel.updatePasswordByEmail(email, hashedPassword);

        return res.json({
            succeeded: true,
            message: 'Đổi mật khẩu thành công'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            succeeded: false,
            message: 'Lỗi server'
        });
    }
}



}
