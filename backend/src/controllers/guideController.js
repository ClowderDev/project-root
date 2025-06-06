// backend/src/controllers/guideController.js
const GuideProfile = require('../models/GuideProfile');

// 

exports.getGuides = async (req, res, next) => {
  try {
    const { locationId } = req.query;
    const filter = locationId
      ? { locations: locationId }
      : {};
    const guides = await GuideProfile.find(filter)
      .populate('user', 'name email');
    res.json(guides);
  } catch (err) {
    next(err);
  }
};

exports.getGuidesByLocation = async (req, res, next) => {
  try {
    const { locationId } = req.query;
    if (!locationId) {
      return res.status(400).json({ message: 'Thiếu locationId' });
    }
    const guides = await GuideProfile.find({ locations: locationId })
      .populate('user', 'name email phone')
      .populate('locations', 'name');
    res.json(guides);
  } catch (err) {
    next(err);
  }
};

exports.getGuideById = async (req, res, next) => {
  try {
    const guide = await GuideProfile.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('locations', 'name');
    if (!guide) return res.status(404).json({ message: 'Guide không tồn tại' });
    res.json(guide);
  } catch (err) {
    next(err);
  }
};

exports.assignLocation = async (req, res, next) => {
  try {
     const guideId = req.params.id;
    const { locationId } = req.body;

    if (!locationId) {
      return res.status(400).json({ message: 'Thiếu locationId' });
    }

    const guide = await GuideProfile.findById(guideId);
    if (!guide) {
      return res.status(404).json({ message: 'Guide không tồn tại' });
    }

    if (!guide.locations.includes(locationId)) {
      guide.locations.push(locationId);
      await guide.save();
      console.log(` Gán location ${locationId} cho guide ${guideId}`);
    }

    res.json({ message: 'Gán thành công', guide });
  } catch (err) {
    console.error(' Lỗi assignLocation:', err);
    next(err);
  }
};

exports.getPendingBookings = async (req, res, next) => {
  try {
    const list = await Booking.find({ status: 'pending' })
      .populate('user', 'name')
      .populate({
        path: 'guide',
        populate: { path:'user', select:'name' }
      })
      .populate('location', 'name');
    res.json(list);
  } catch (err) {
    next(err);
  }
};
