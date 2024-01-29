const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const EnergyData = require('./models/EnergyData');
const Alert = require('./models/AlertData');
const errorHandler = require('./middleware/errorHandler');
const SolarData = require('./models/solar-data.model');
const Device = require('./models/device.model');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'xr-spatial-tracking=()');
    next();
  });

// Connect to DB
connectDB();

// API Endpoints
app.get('/api/realtime', async (req, res) => {
    const data = await EnergyData.findOne().sort({ timestamp: -1 }).limit(5);
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ message: "No data available" });
    }
});

app.get('/api/historical', async (req, res) => {
    const data = await EnergyData.find().sort({ timestamp: -1 });
    res.json(data);
});

// To simulate data generation
app.post('/api/simulate', async (req, res) => {
    const newEntry = new EnergyData(req.body);
    const savedEntry = await newEntry.save();
    res.json(savedEntry);
});

// Create a new energy data entry
app.post('/api/energy-data', async (req, res) => {
    const newEntry = new EnergyData(req.body);
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
});

// Update an existing energy data entry
app.put('/api/energy-data/:id', async (req, res) => {
    const updatedEntry = await EnergyData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedEntry) {
        res.json(updatedEntry);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
});

// Delete an energy data entry
app.delete('/api/energy-data/:id', async (req, res) => {
    const deletedEntry = await EnergyData.findByIdAndDelete(req.params.id);
    if (deletedEntry) {
        res.json({ message: 'Data deleted successfully' });
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
});

// GET endpoint to fetch all devices
app.get('/api/devices', async (req, res) => {
    try {
        const devices = await Device.find();
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST endpoint to toggle a device's status
app.post('/api/devices/:id/toggle', async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);
        if (device) {
            device.status = device.status === 'On' ? 'Off' : 'On';
            await device.save();
            res.json(device);
        } else {
            res.status(404).json({ message: 'Device not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all solar data
app.get('/api/solar-data', async (req, res) => {
    const limit = parseInt(req.query.limit) || 0; // Default to no limit if not specified
    try {
        const data = await SolarData.find({}).sort({ timestamp: -1 }).limit(limit);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.get('/api/solar-data/latest', async (req, res) => {
    try {
        const latestData = await SolarData.findOne().sort({ timestamp: -1 }).limit(1);
        res.json(latestData);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.get('/api/solar-data/range', async (req, res) => {
    try {
        const { start, end } = req.query;
        const startDate = new Date(start);
        const endDate = new Date(end);

        // Ensure endDate is the end of the day
        endDate.setHours(23, 59, 59, 999);

        const data = await SolarData.find({
            timestamp: { $gte: startDate, $lte: endDate }
        }).sort({ timestamp: 1 }); // Sorting by timestamp

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// Get solar data by date
app.get('/api/solar-data/:date', async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const data = await SolarData.find({
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        });

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// Post new solar data
app.post('/api/solar-data', async (req, res) => {
    try {
        const newData = new SolarData(req.body);
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update solar data
app.put('/api/solar-data/:id', async (req, res) => {
    try {
        const updatedData = await SolarData.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedData);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete solar data
app.delete('/api/solar-data/:id', async (req, res) => {
    try {
        const deletedData = await SolarData.findByIdAndDelete(req.params.id);
        res.json(deletedData);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/filtered-data', async (req, res) => {
    const { startDate, endDate, roomTemperature, humidity, occupancy } = req.query;

    let query = {
        timestamp: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        },
        ...(roomTemperature && { roomTemperature: roomTemperature }),
        ...(humidity && { humidity: humidity }),
        ...(occupancy && { occupancy: occupancy })
    };

    try {
        const data = await EnergyData.find(query).sort({ timestamp: -1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error: error });
    }
});


// Get all active alerts
app.get('/api/alerts', async (req, res) => {
    const alerts = await Alert.find({ isActive: true });
    res.json(alerts);
});

// Create a new alert
app.post('/api/alerts', async (req, res) => {
    const newAlert = new Alert(req.body);
    const savedAlert = await newAlert.save();
    res.status(201).json(savedAlert);
});

// Delete an alert
app.delete('/api/alerts/:id', async (req, res) => {
    const deletedAlert = await Alert.findByIdAndDelete(req.params.id);
    if (deletedAlert) {
        res.json({ message: 'Alert deleted successfully' });
    } else {
        res.status(404).json({ message: 'Alert not found' });
    }
});

// Acknowledge an alert
app.put('/api/alerts/:id/acknowledge', async (req, res) => {
    const acknowledgedAlert = await Alert.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (acknowledgedAlert) {
        res.json(acknowledgedAlert);
    } else {
        res.status(404).json({ message: 'Alert not found' });
    }
});



// Middleware for error handling
app.use(errorHandler);

// Listen on port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
