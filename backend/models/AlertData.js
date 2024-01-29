const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  type: String,
  condition: String,
  value: Number,
  isActive: {
    type: Boolean,
    default: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', AlertSchema);
