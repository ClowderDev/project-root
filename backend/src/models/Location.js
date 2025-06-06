const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  description:{ type: String },
  category:   { type: String },
  price:      { type: Number },
  images:  { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
