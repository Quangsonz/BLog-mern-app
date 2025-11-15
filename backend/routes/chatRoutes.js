const express = require('express');
const router = express.Router();
const { sendMessage, getContext } = require('../controllers/chatController');

// POST /api/chat - Gửi tin nhắn và nhận phản hồi từ AI
router.post('/chat', sendMessage);

// GET /api/chat/context - Lấy context về platform (optional)
router.get('/chat/context', getContext);

module.exports = router;
