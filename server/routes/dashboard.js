const express = require('express');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilReport = require('../models/SoilReport');
const PestAlert = require('../models/PestAlert');
const FarmActivity = require('../models/FarmActivity');
const WeatherRecord = require('../models/WeatherRecord');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const farmsCount = await Farm.countDocuments({ owner: req.user._id });
  const activeCrops = await Crop.countDocuments({ owner: req.user._id, healthStatus: { $in: ['Healthy', 'Monitoring'] } });
  const upcomingHarvests = await Crop.find({ owner: req.user._id, expectedHarvestDate: { $gte: new Date() } }).sort({ expectedHarvestDate: 1 }).limit(5);
  const latestWeather = await WeatherRecord.findOne({ owner: req.user._id }).sort({ forecastTimestamp: -1 });
  const latestSoil = await SoilReport.findOne({ owner: req.user._id }).sort({ testDate: -1 });
  const activeAlerts = await PestAlert.find({ owner: req.user._id, status: { $ne: 'Resolved' } }).sort({ createdAt: -1 }).limit(5);
  const activities = await FarmActivity.find({ user: req.user._id }).sort({ date: -1 }).limit(6);

  const cropHealth = await Crop.aggregate([
    { $match: { owner: req.user._id } },
    { $group: { _id: '$healthStatus', count: { $sum: 1 } } },
  ]);

  const monthlyData = await Crop.aggregate([
    { $match: { owner: req.user._id } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$plantingDate' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    stats: {
      totalFarms: farmsCount,
      activeCrops,
      upcomingHarvests: upcomingHarvests.length,
      latestWeather,
      soilSummary: latestSoil,
      activeAlerts: activeAlerts.length,
      recentActivities: activities.length,
    },
    cropHealth,
    monthlyData,
    upcomingHarvests,
    activeAlerts,
    activities,
  });
});

module.exports = router;
