// backend/src/server.js
const http = require('http');
const express = require('express')
const app = require('./app');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

const ChatMessage = require('./models/ChatMessage');


dotenv.config();

// Kết nối MongoDB trước khi start server

const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',   
    methods: ['GET','POST']
  }
});

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on('chatMessage', async ({ roomId, senderId, senderName, message }) => {
    // 1. Lưu vào DB
    const chat = new ChatMessage({ roomId, senderId, senderName, message });
    await chat.save();

    // 2. Phát tin nhắn đến room
    io.to(roomId).emit('chatMessage', {
      senderName,
      message,
      timestamp: chat.timestamp
    });

    // 3. Gửi notification đến tất cả socket đang kết nối (ngoại trừ room đang chat)
    socket.broadcast.emit('newMessageNotification', { roomId });
  });
});


connectDB();

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
