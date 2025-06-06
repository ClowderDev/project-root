// backend/src/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const GuideProfile = require('../models/GuideProfile');

dotenv.config();

const jwt = require('jsonwebtoken');


// Tạo JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, certifications, languages, bio } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error('Vui lòng cung cấp tên, email, mật khẩu và vai trò');
    }

    // Kiểm tra email đã tồn tại
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400);
      throw new Error('Email đã được đăng ký');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Tạo user với status pending nếu là guide
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role,
      status: role === 'guide' ? 'pending' : 'active'
    });

    if (role === 'guide') {
      await GuideProfile.create({
        user:       user._id,
        certifications: certifications || [],
        languages:      languages || [],
        bio:            bio || '',
        approved: false
      });
    }

    // Trả về token và thông tin cơ bản
    res.status(201).json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400);
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h'  
    });

    // Trả về token và thông tin cơ bản
    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};
