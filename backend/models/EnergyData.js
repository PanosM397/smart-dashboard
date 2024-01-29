const mongoose = require('mongoose');

const EnergyDataSchema = new mongoose.Schema({
    energyConsumption: {
        type: Number,
        required: [true, 'Energy consumption is required'],
        min: [0, 'Energy consumption cannot be negative']
    },
    roomTemperature: {
        type: Number,
        required: [true, 'Room temperature is required'],
        min: [-30, 'Minimum temperature should be -30°C'],
        max: [50, 'Maximum temperature should be 50°C']
    },
    humidity: {
        type: Number,
        required: [true, 'Humidity is required'],
        min: [0, 'Humidity cannot be negative'],
        max: [100, 'Maximum humidity should be 100']
    },
    occupancy: {
        type: Number,
        required: [true, 'Occupancy is required'],
        min: [0, 'Occupancy cannot be negative']
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('EnergyData', EnergyDataSchema);
