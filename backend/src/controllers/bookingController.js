const Booking = require('../models/Booking');
const GuideProfile = require('../models/GuideProfile');
const Location = require('../models/Location');

// Tạo booking mới
exports.createBooking = async (req, res, next) => {
  try {
    const userId  = req.user._id;           
    const { guideId, locationId, date, timeSlot } = req.body;

    // Validate
    if (!guideId || !locationId || !date || !timeSlot) {
      res.status(400);
      throw new Error('Thiếu thông tin guideId, locationId, date hoặc timeSlot');
    }

    // Fetch the location to get the price
    const location = await Location.findById(locationId);
    if (!location) {
      res.status(404);
      throw new Error('Không tìm thấy địa điểm');
    }

    // Create and save booking
    const booking = await Booking.create({
      user: userId,
      guide: guideId,
      location: locationId,
      date: new Date(date),
      timeSlot,
      price: location.price
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error('❌ createBooking error:', err);
    next(err);
  }
};

// Lấy danh sách booking của user
exports.getMyBookings = async (req, res, next) => {
  console.log('🍀 getMyBookings user:', req.user);
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: 'guide',
        select: '_id locations approved',  
        populate: {
          path: 'user',
          model: 'User',
          select: 'name'                  
        }
      })
      .populate('location', 'name')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// Lấy danh sách booking của guide
exports.getGuideBookings = async (req, res, next) => {
  try {
    const guideId = req.user._id;
    const list = await Booking.find({ guide: guideId })
      .populate('user', 'name email')
      .sort({ date: 1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate({
        path: 'guide',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      })
      .populate('location', 'name description imageUrl category');
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy booking' });
    }
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

exports.getPendingBookings = async (req, res, next) => {
  try {
    const guideId = req.user._id;
    const bookings = await Booking.find({ status: 'pending' })
      .populate('user', 'name')
      .populate({
        path: 'guide',
        populate: { path:'user', select:'name' }
      })
      .populate('location', 'name');
    res.json(bookings);
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