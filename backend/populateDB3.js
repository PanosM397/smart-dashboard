const mongoose = require('mongoose');
const Device = require('./models/device.model'); 

// MongoDB connection string, replace with your actual connection string
const dbURI = 'mongodb://localhost:27017/';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const mockDevices = [
  { id: 1, name: 'HVAC System Lobby', status: 'Off', type: 'Climate Control', location: 'Lobby' },
  { id: 2, name: 'HVAC System Office', status: 'On', type: 'Climate Control', location: 'Office' },
  { id: 3, name: 'Lighting System Lobby', status: 'On', type: 'Lighting', location: 'Lobby' },
  { id: 4, name: 'Lighting System Office', status: 'Off', type: 'Lighting', location: 'Office' },
  { id: 5, name: 'Security Camera Parking', status: 'On', type: 'Security', location: 'Parking Lot' },
  { id: 6, name: 'Elevator', status: 'On', type: 'Transport', location: 'Main Shaft' },
  { id: 7, name: 'Smart Window Office', status: 'Off', type: 'Window', location: 'Office' },
  { id: 8, name: 'Energy Meter', status: 'On', type: 'Sensor', location: 'Basement' },
  { id: 9, name: 'Water Leak Sensor', status: 'Off', type: 'Sensor', location: 'Bathroom' },
  { id: 10, name: 'Fire Alarm System', status: 'On', type: 'Alarm', location: 'Kitchen' },
  { id: 11, name: 'Smart Thermostat Lobby', status: 'Off', type: 'Climate Control', location: 'Lobby' },
  // Additional mock devices can be added here
];

  

Device.insertMany(mockDevices)
  .then(() => {
    console.log('Mock devices inserted into the database successfully!');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error inserting mock devices:', error);
    mongoose.connection.close();
  });
