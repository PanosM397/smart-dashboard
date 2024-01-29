const mongoose = require('mongoose');
const dotenv = require('dotenv');
const EnergyData = require('./models/EnergyData');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed', error);
    process.exit(1);
  }
};

const getRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const populateDB = async () => {
  // Connect to the database
  await connectDB();

  // Sample data to populate the database
  const sampleData = [];
  
  for (let i = 0; i < 10000; i++) {
    const energyConsumption = getRandomValue(100, 200);
    const roomTemperature = getRandomValue(18, 25);
    const humidity = getRandomValue(30, 60);
    const occupancy = getRandomValue(0, 10);
    
    sampleData.push({
      energyConsumption,
      roomTemperature,
      humidity,
      occupancy,
      timestamp: new Date(Date.now() - i * 3600000) // stepping back one hour per record
    });
  }

  try {
    // Insert sample data into the database
    await EnergyData.insertMany(sampleData);
    console.log('Data successfully inserted');
    process.exit();
  } catch (error) {
    console.error('Error populating database', error);
    process.exit(1);
  }
};

populateDB();
