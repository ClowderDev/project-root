// backend/src/controllers/locationController.js
const Location = require('../models/Location');
const mongoose = require('mongoose');
// Lấy danh sách tất cả location
exports.getLocations = async (req, res, next) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    next(err);
  }
};

// Lấy chi tiết một location theo ID
exports.getLocationById = async (req, res, next) => {
  const id = req.params.id;

  // Kiểm tra ID hợp lệ
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }

  try {
    const location = await Location.findById(id); 

    if (!location) {
      return res.status(404).json({ message: 'Không tìm thấy địa điểm' });
    }

    // Trả dữ liệu
    res.json({
      id: location._id,
      name: location.name,
      description: location.description,
      category: location.category,
      price: location.price,
      images: location.images,
      createdAt: location.createdAt
    });

  } catch (err) {
    console.error(' Lỗi lấy location:', err);
    res.status(500).json({ message: 'Lỗi server nội bộ' });
  }
};

// Tạo mới một location (cần login)
exports.createLocation = async (req, res, next) => {

  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({
      success: false,
      error: "Thiếu dữ liệu trong request body"
    });
  }

  const { name } = req.body;

  // Kiểm tra trường bắt buộc
  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Tên địa điểm là bắt buộc"
    });
  }

  try {
    const { name, description, category, price } = req.body;
    const images = req.files.map(f => `/uploads/${f.filename}`);
    // Validate
    if (!name) {
      return res.status(400).json({ message: 'Tên địa điểm bắt buộc' });
    }
    if (images && (!Array.isArray(images) || images.length > 10)) {
      return res.status(400).json({ message: 'imageUrls phải là mảng tối đa 10 phần tử' });
    }

    const loc = await Location.create({
      name,
      description,
      category,
      price,
      images: images || []
    });

    res.status(201).json(loc);
  } catch (err) {
    next(err);
  }
};
