const express = require('express');
const router = express.Router();
const { getHistory } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:roomId', authMiddleware, getHistory);

module.exports = router;
