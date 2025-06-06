const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

exports.createPayment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { bookingId, method } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking' });

    const payment = await Payment.create({
      user: userId,
      booking: bookingId,
      method,
      amount: 500000, 
      status: 'paid'
    });

    booking.status = 'confirmed';
    await booking.save();

    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
};
