const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['pending','active','inactive','banned'],
    default: function() {
      return this.role === 'guide' ? 'pending' : 'active';
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
