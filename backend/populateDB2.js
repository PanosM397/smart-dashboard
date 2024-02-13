const mongoose = require("mongoose");
const SolarData = require("../backend/models/solar-data.model");
const dotenv = require("dotenv");

dotenv.config();

// MongoDB Connection URI
// const mongoURI = "mongodb://localhost:27017";
// mongodb://userAdmin:Sinergatis2022!@localhost:27017/yourDatabaseName?authSource=admin

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};

// Function to generate random data
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to simulate efficiency based on time of day
function simulateEfficiency(hour) {
  // Assuming peak efficiency is at noon and drops off towards the evening and morning
  const peakHour = 12;
  const efficiencyDropOff = Math.max(
    0,
    1 - Math.abs(hour - peakHour) / peakHour
  );
  return efficiencyDropOff * getRandomInt(70, 100); // Simulating a range of 70% - 100% efficiency
}

// Generate data for each hour of a week
async function generateData() {
  await connectDB();

  try {
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const energyGenerated = getRandomInt(0, 50); // Replace with a function that uses more realistic values
        const efficiency = simulateEfficiency(hour);

        const newEntry = new SolarData({
          timestamp: new Date().setHours(hour, 0, 0, 0),
          energyGenerated,
          energyConsumed: energyGenerated * (1 - efficiency / 100), // Some energy is always consumed by the system
          efficiency,
        });

        await newEntry.save();
        console.log(
          `Data saved for day ${day + 1}, hour ${hour}: ${JSON.stringify(
            newEntry
          )}`
        );
      }
    }
    console.log("Data generation complete.");
    process.exit(); // Exit cleanly on completion
  } catch (error) {
    console.error("An error occurred during data generation:", error);
    process.exit(1); // Exit with an error code on failure
  }
}

// Run the data generation function
generateData();
