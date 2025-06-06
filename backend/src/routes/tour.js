const express = require('express');
const router = express.Router();
const {updateBookingStatus, getPendingBookings, getAllBookings} = require('../controllers/tourController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware, (req,res,next) => {
  if (req.user.role!=='guide') return res.status(403).json({ message:'Chỉ guide' });
  next();
});

router.put('/bookings/:id', updateBookingStatus);
router.get('/bookings/pending', getPendingBookings);
router.get('/bookings', getAllBookings);

module.exports = router;