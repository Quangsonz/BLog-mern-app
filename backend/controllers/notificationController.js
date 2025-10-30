const Notification = require('../models/notificationModel');
const ErrorResponse = require('../utils/errorResponse');

// Get user notifications
exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('sender', 'name avatar')
            .populate('post', 'category')
            .sort({ createdAt: -1 })
            .limit(20);

        const unreadCount = await Notification.countDocuments({
            recipient: req.user._id,
            read: false
        });

        res.status(200).json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        next(error);
    }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return next(new ErrorResponse('Notification not found', 404));
        }

        // Check if user is the recipient
        if (notification.recipient.toString() !== req.user._id.toString()) {
            return next(new ErrorResponse('Not authorized', 401));
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        next(error);
    }
};

// Mark all notifications as read
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

// Delete notification
exports.deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return next(new ErrorResponse('Notification not found', 404));
        }

        // Check if user is the recipient
        if (notification.recipient.toString() !== req.user._id.toString()) {
            return next(new ErrorResponse('Not authorized', 401));
        }

        await notification.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Notification deleted'
        });
    } catch (error) {
        next(error);
    }
};

// Create notification (helper function)
exports.createNotification = async ({ recipient, sender, post, type, message }) => {
    try {
        // Don't create notification if sender is the same as recipient
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
