const mongoose = require('mongoose');

const solarDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  energyGenerated: { type: Number, required: true }, // in kWh
  energyConsumed: { type: Number, required: true }, // in kWh
  efficiency: { type: Number, required: true }, // percentage

});

module.exports = mongoose.model('SolarData', solarDataSchema);