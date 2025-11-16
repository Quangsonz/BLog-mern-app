const Notification = require('../models/notificationModel');
const ErrorResponse = require('../utils/errorResponse');

// lấy danh sách thông báo cho người dùng
exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id }) // lọc thông báo cho người dùng hiện tại
            .populate('sender', 'name avatar')// lấy thông tin người gửi
            .populate('post', 'category') // lấy thông tin bài viết liên quan
            .sort({ createdAt: -1 }) // sắp xếp theo thời gian tạo giảm dần
            .limit(20); // giới hạn số lượng thông báo trả về

        const unreadCount = await Notification.countDocuments({ // đếm số thông báo chưa đọc cho người dùng hiện tại
            recipient: req.user._id, // lọc theo người nhận
            read: false // chỉ đếm thông báo chưa đọc
        });

        res.status(200).json({ // trả về danh sách thông báo và số lượng chưa đọc
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        next(error);
    }
};

// dùng để đánh dấu đã đọc thông báo
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id); // tìm thông báo theo ID

        if (!notification) { 
            return next(new ErrorResponse('Notification not found', 404));
        }

        // Check if user is the recipient
        if (notification.recipient.toString() !== req.user._id.toString()) { // kiểm tra nếu người dùng không phải là người nhận
            return next(new ErrorResponse('Not authorized', 401));
        }

        notification.read = true; // đánh dấu thông báo đã đọc
        await notification.save(); // lưu thay đổi

        res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        next(error);
    }
};

// dùng để đánh dấu tất cả thông báo đã đọc
exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, read: false },
            { read: true }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        next(error);
    }
};

//dùng đẻ đã đọc thông báo
// exports.deleteNotification = async (req, res, next) => {
//     try {
//         const notification = await Notification.findById(req.params.id);

//         if (!notification) {
//             return next(new ErrorResponse('Notification not found', 404));
//         }

//         // Check if user is the recipient
//         if (notification.recipient.toString() !== req.user._id.toString()) {
//             return next(new ErrorResponse('Not authorized', 401));
//         }

//         await notification.deleteOne();

//         res.status(200).json({
//             success: true,
//             message: 'Notification deleted'
//         });
//     } catch (error) {
//         next(error);
//     }
// };
// tạo thông báo cho người dùng
exports.createNotification = async ({ recipient, sender, post, type, message }) => {
    try {
        // nếu người gửi và người nhận giống nhau thì không tạo thông báo
        if (sender.toString() === recipient.toString()) {
            return null;
        }

        const notification = await Notification.create({
            recipient,
            sender,
            post,
            type,
            message
        });

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
};
