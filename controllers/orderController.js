import orderModel from '../models/orderModel.js';

export default class orderController {
    // ... (Giữ nguyên hàm getAll)
    static async getAll(req, res) {
            console.log("--> Android gọi: getAll");
            try {
                const orders = await orderModel.getAllOrders();
                res.status(200).json(orders);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Lỗi server' });
            }
        }

        static async updateStatus(req, res) {
        try {
            const { order_id, status } = req.body; // Nhận id và status mới từ Android
            await orderModel.updateStatus(order_id, status);
            res.status(200).json({ message: 'Cập nhật thành công!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // HÀM MỚI: Xử lý request lấy chi tiết
    static async getDetail(req, res) {
        try {
            const { id } = req.params;
            const order = await orderModel.getOrderDetail(id);
            console.log(order);
            
            if (!order) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
            res.status(200).json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
}