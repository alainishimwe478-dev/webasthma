import express from 'express';
import fetch from 'node-fetch';
import EnvironmentReading from '../models/EnvironmentReading.js';

const router = express.Router();

// Locations
const LOCATIONS = {
  Kigali: { lat: -1.9441, lon: 30.0619 },
  Huye: { lat: -2.5858, lon: 29.7390 },
  Rubavu: { lat: -1.6851, lon: 29.2560 },
  Musanze: { lat: -1.4998, lon: 29.6359 },
  Muhanga: { lat: -2.0845, lon: 29.7550 },
  Nyamagabe: { lat: -2.4328, lon: 29.1528 },
  Rusizi: { lat: -2.5528, lon: 28.9071 },
  Ngororero: { lat: -2.0324, lon: 29.6350 },
  Karongi: { lat: -2.1606, lon: 29.3384 },
  Rutsiro: { lat: -1.8733, lon: 29.0925 }
};

// Get latest readings for all districts
router.get('/readings', async (req, res) => {
  try {
    const readings = await EnvironmentReading.find()
      .sort({ timestamp: -1 })
      .limit(10);

    // Group by district, get latest for each
    const latestByDistrict = {};
    readings.forEach(reading => {
      if (!latestByDistrict[reading.district]) {
        latestByDistrict[reading.district] = reading;
      }
    });

    res.json(Object.values(latestByDistrict));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get readings for specific district
router.get('/readings/:district', async (req, res) => {
  try {
    const { district } = req.params;
    const readings = await EnvironmentReading.find({ district })
      .sort({ timestamp: -1 })
      .limit(24); // Last 24 readings

    res.json(readings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch and store new readings (cron job)
router.post('/fetch-readings', async (req, res) => {
  try {
    const readings = [];

    for (const [district, coords] of Object.entries(LOCATIONS)) {
      try {
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${process.env.OPENWEATHER_KEY}`
        );
        const weather = await weatherRes.json();

        const aqiRes = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coords.lat}&lon=${coords.lon}&appid=${process.env.OPENWEATHER_KEY}`
        );
        const aqi = await aqiRes.json();

        const reading = new EnvironmentReading({
          district,
          latitude: coords.lat,
          longitude: coords.lon,
          temperature: weather.main.temp,
          humidity: weather.main.humidity,
          pm25: aqi.list[0].components.pm2_5,
          pm10: aqi.list[0].components.pm10,
          no2: aqi.list[0].components.no2,
          so2: aqi.list[0].components.so2,
          co: aqi.list[0].components.co,
          o3: aqi.list[0].components.o3,
          weatherDescription: weather.weather[0].description,
          aqi: aqi.list[0].main.aqi,
          pollenLevel: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Moderate' : 'Low' // Mock
        });

        await reading.save();
        readings.push(reading);
      } catch (err) {
        console.error(`Error fetching data for ${district}:`, err);
      }
    }

    res.json({ message: 'Readings updated', count: readings.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get alerts for districts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = {};
    const latestReadings = await EnvironmentReading.find()
      .sort({ timestamp: -1 })
      .limit(10);

    latestReadings.forEach(reading => {
      if (reading.aqi > 100) {
        alerts[reading.district] = `High AQI (${reading.aqi}) detected. Limit outdoor activities.`;
      } else if (reading.temperature > 35) {
        alerts[reading.district] = `Extreme heat (${reading.temperature}°C) warning. Stay hydrated.`;
      } else if (reading.humidity > 80) {
        alerts[reading.district] = `High humidity (${reading.humidity}%) may trigger symptoms.`;
      }
    });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;