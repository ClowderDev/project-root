const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const app        = express();
const errorHandler = require('./middleware/errorHandler');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const locationRoutes = require('./routes/location');
app.use('/api/locations', locationRoutes);

const guideRoutes = require('./routes/guide');
app.use('/api/guides', guideRoutes);

const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

const bookingRoutes = require('./routes/booking');
app.use('/api/bookings', bookingRoutes);

const reviewRoutes = require('./routes/review');
app.use('/api/reviews', reviewRoutes);

const paymentRoutes = require('./routes/payment');
app.use('/api/payments', paymentRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const tourRoutes = require('./routes/tour');
app.use('/api/tour', tourRoutes);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));




// Middleware xử lý lỗi
app.use(errorHandler);

module.exports = app;
