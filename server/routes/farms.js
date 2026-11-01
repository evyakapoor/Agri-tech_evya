const express = require('express');
const { body, validationResult } = require('express-validator');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilReport = require('../models/SoilReport');
const PestAlert = require('../models/PestAlert');
const FarmActivity = require('../models/FarmActivity');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  const farms = await Farm.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ farms });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findOne({ _id: id, owner: req.user._id });
  if (!farm) return res.status(404).json({ message: 'Farm not found.' });

  const crops = await Crop.find({ farm: id, owner: req.user._id });
  const soilReports = await SoilReport.find({ farm: id, owner: req.user._id }).sort({ testDate: -1 }).limit(5);
  const alerts = await PestAlert.find({ farm: id, owner: req.user._id }).sort({ createdAt: -1 }).limit(5);
  const activities = await FarmActivity.find({ farm: id, user: req.user._id }).sort({ date: -1 }).limit(5);

  res.json({ farm, crops, soilReports, alerts, activities });
});

router.post('/', [
  body('name').notEmpty(),
  body('totalArea').isNumeric(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const farm = await Farm.create({
      ...req.body,
      owner: req.user._id,
    });

    await FarmActivity.create({
      farm: farm._id,
      user: req.user._id,
      activityType: 'Farm created',
      description: `Farm ${farm.name} was created.`,
      date: new Date(),
    });

    res.status(201).json({ farm });
  } catch (error) {
    res.status(500).json({ message: 'Farm creation failed.', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const farm = await Farm.findOne({ _id: req.params.id, owner: req.user._id });
  if (!farm) return res.status(404).json({ message: 'Farm not found.' });

  const updatedFarm = await Farm.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ farm: updatedFarm });
});

router.delete('/:id', async (req, res) => {
  const deleted = await Farm.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!deleted) return res.status(404).json({ message: 'Farm not found.' });

  await Crop.deleteMany({ farm: req.params.id, owner: req.user._id });
  await SoilReport.deleteMany({ farm: req.params.id, owner: req.user._id });
  await PestAlert.deleteMany({ farm: req.params.id, owner: req.user._id });
  await FarmActivity.deleteMany({ farm: req.params.id, user: req.user._id });

  res.json({ message: 'Farm deleted successfully.' });
});

module.exports = router;
