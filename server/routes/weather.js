const express = require('express');
const { protect } = require('../middleware/auth');
const WeatherRecord = require('../models/WeatherRecord');
const Farm = require('../models/Farm');

const router = express.Router();
router.use(protect);

async function getLiveWeather(location, farmId) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (apiKey) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return {
          location,
          temperature: data.main?.temp ?? 28,
          humidity: data.main?.humidity ?? 65,
          rainfall: data.rain?.['1h'] ?? 0,
          windSpeed: data.wind?.speed ?? 6,
          forecastTimestamp: new Date(),
          provider: 'OpenWeather',
          freshness: 'live',
          farmId,
        };
      }
    } catch (error) {
      console.error('Weather fetch failed:', error.message);
    }
  }

  return {
    location,
    temperature: 28.4,
    humidity: 68,
    rainfall: 12,
    windSpeed: 7.2,
    forecastTimestamp: new Date(),
    provider: 'Fallback demo',
    freshness: 'simulated',
    farmId,
  };
}

router.get('/forecast', async (req, res) => {
  const farmId = req.query.farmId || null;
  const farm = farmId ? await Farm.findOne({ _id: farmId, owner: req.user._id }) : null;
  const location = farm?.address || req.query.location || req.user.location || 'Pune';

  const snapshot = await getLiveWeather(location, farmId);
  const record = await WeatherRecord.create({
    owner: req.user._id,
    farm: farmId || undefined,
    location: snapshot.location,
    temperature: snapshot.temperature,
    humidity: snapshot.humidity,
    rainfall: snapshot.rainfall,
    windSpeed: snapshot.windSpeed,
    forecastTimestamp: snapshot.forecastTimestamp,
    provider: snapshot.provider,
    freshness: snapshot.freshness,
  });

  res.json({ weather: record });
});

router.get('/history', async (req, res) => {
  const records = await WeatherRecord.find({ owner: req.user._id }).sort({ forecastTimestamp: -1 }).limit(10);
  res.json({ weather: records });
});

module.exports = router;
