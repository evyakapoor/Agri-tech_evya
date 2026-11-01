const mongoose = require('mongoose');

const weatherRecordSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
  location: { type: String, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  rainfall: { type: Number, default: 0 },
  windSpeed: { type: Number, default: 0 },
  forecastTimestamp: { type: Date, default: Date.now },
  provider: { type: String, default: 'OpenWeather' },
  freshness: { type: String, default: 'live' },
}, { timestamps: true });

module.exports = mongoose.model('WeatherRecord', weatherRecordSchema);
