const mongoose = require('mongoose');
const EnergyData = require('./models/EnergyData');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/energy_dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Random number generator function
const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Generate and save simulated data to MongoDB
const generateData = async () => {
  try {
    for (let i = 0; i < 1000; i++) {  // Generate 1000 records
      const energyData = new EnergyData({
        energyConsumption: getRandomNumber(50, 200),
        roomTemperature: getRandomNumber(15, 30),
        humidity: getRandomNumber(30, 60),
        occupancy: getRandomNumber(0, 100),
      });

      await energyData.save();
    }

    console.log('Data successfully generated and saved to MongoDB');
    process.exit(0);  // Close the script
  } catch (error) {
    console.error('Error generating data: ', error);
    process.exit(1);  // Close the script with an error code
  }
};

// Run the data generation function
generateData();
