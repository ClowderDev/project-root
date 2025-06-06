const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/authMiddleware');
const bc      = require('../controllers/bookingController');

// Tạo booking (user phải login)
router.post('/', auth, bc.createBooking);

// Lấy booking của user
router.get('/my', auth, bc.getMyBookings);

// Lấy booking của guide
router.get('/guide', auth, bc.getGuideBookings);

router.get('/:id', auth, bc.getBookingById);

router.get('/bookings/pending', auth, bc.getPendingBookings);



module.exports = router;
