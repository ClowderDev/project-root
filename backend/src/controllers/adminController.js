const User = require('../models/User');
const GuideProfile = require('../models/GuideProfile');
const Location = require('../models/Location');

exports.getPendingGuides = async (req, res, next) => {
  try {
    // Tìm tất cả hồ sơ guide chưa được duyệt
    const guides = await GuideProfile
      .find({ approved: false })
      .populate('user', 'name email');    
    res.json(guides);
  } catch (err) {
    next(err);
  }
};

exports.approveGuide = async (req, res, next) => {
  try {
    const { id } = req.params; 
    
    // 1. Tìm profile và lấy user ID
    const profile = await GuideProfile.findById(id);
    if (!profile) {
      return res.status(404).json({ message: 'Hồ sơ không tồn tại' });
    }

    const userId = profile.user; 

    // 2. Cập nhật user
    const user = await User.findByIdAndUpdate(
      userId,
      { status: 'active' },
      { new: true }
    );

    // 3. Cập nhật profile
    await GuideProfile.findByIdAndUpdate(id, { approved: true });

    res.json({ message: 'Duyệt thành công', user });
  } catch (err) {
    next(err);
  }
};


exports.rejectGuide = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Cập nhật status = 'inactive' hoặc xóa profile
    await User.findByIdAndUpdate(id, { status: 'inactive' });
    res.json({ message:'Từ chối hồ sơ hướng dẫn viên' });
  } catch (err) {
    next(err);
  }
};

const Booking = require('../models/Booking');

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


exports.getStatistics = async (req, res, next) => {
  try {
    const [guideCount, locationCount, bookingCount] = await Promise.all([
      GuideProfile.countDocuments({ approved: true }),
      Location.countDocuments(),
      Booking.countDocuments()
    ]);
    res.json({ guideCount, locationCount, bookingCount });
  } catch (err) {
    next(err);
  }
};

exports.getChartData = async (req, res, next) => {
  try {
    const oneWeek = new Date(new Date().setDate(new Date().getDate() - 7));
    
    // Tìm tất cả booking trong tháng
    const bookings = await Booking.find({
      createdAt: {
        $gte: oneWeek,
        $lte: new Date()
      }
    }).populate({
      path: 'location',
      select: 'price'
    });

    const dailyTotals = new Map();
    
    const today = new Date();
    for (let d = new Date(oneWeek); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dailyTotals.set(dateStr, {
        totalMoney: 0,
        bookingCount: 0
      });
    }

    //Tính tổng tiền, số lượng booking từng ngày
    bookings.forEach(booking => {
      const dateStr = booking.createdAt.toISOString().split('T')[0];
      const dayData = dailyTotals.get(dateStr);
      if (dayData) {
        dayData.totalMoney += booking.price || 0;
        dayData.bookingCount += 1;
      }
    });

    // Chuyển về array cho frontend
    const chartData = Array.from(dailyTotals.entries()).map(([date, data]) => ({
      date,
      totalMoney: data.totalMoney,
      bookingCount: data.bookingCount
    }));

    res.json(chartData);
  } catch (err) {
    console.error('ChartData error:', err);
    next(err);
  }
};
