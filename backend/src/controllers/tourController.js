const Booking = require('../models/Booking');
const mongoose = require('mongoose');


exports.getPendingBookings = async (req, res, next) => {
    try {
        const guideId = req.user.id;
        const list = await Booking.find({guide:guideId, status:'pending'})
            .populate('user', 'name')
            .populate('location', 'name');
        res.json(list);
    } catch (err) {
        next(err);
    }
};

exports.getAllBookings = async (req, res, next) => {
    try {
        const guideIdString = req.user.id;
        const guideId = mongoose.Types.ObjectId(guideIdString);
        console.log("Đây là guideId: ",guideId);
        const list = await Booking.find({guide: guideId })
            .populate('user', 'name')
            .populate('location', 'name');
        res.json(list);
    } catch (err) {
        next(err);
    }
};  

exports.updateBookingStatus = async (req, res, next) => {
    try {
      const { id }     = req.params;
      const { status } = req.body;
      if (!['confirmed','cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Status không hợp lệ' });
      }
      const booking = await Booking.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (!booking) {
        return res.status(404).json({ message: 'Không tìm thấy booking' });
      }
      res.json(booking);
    } catch (err) {
      next(err);
    }
  };