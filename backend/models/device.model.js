const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  _id: Number,
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['On', 'Off'],
    default: 'Off'
  },
  type: {
    type: String,
    required: true
  },
  location: {
    type: String,
  },
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
