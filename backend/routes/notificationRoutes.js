const express = require('express');
const router = express.Router();
const { 
    getNotifications, 
    markAsRead, 
    markAllAsRead,
    deleteNotification 
} = require('../controllers/notificationController');
const { isAuthenticated } = require('../middleware/auth');

// All routes require authentication
router.get('/notifications', isAuthenticated, getNotifications);
router.put('/notifications/:id/read', isAuthenticated, markAsRead);
router.put('/notifications/read-all', isAuthenticated, markAllAsRead);
router.delete('/notifications/:id', isAuthenticated, deleteNotification);

module.exports = router;
