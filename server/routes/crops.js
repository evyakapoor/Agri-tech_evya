const express = require('express');
const { body, validationResult } = require('express-validator');
const Crop = require('../models/Crop');
const Farm = require('../models/Farm');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  const { farm, status } = req.query;
  const filter = { owner: req.user._id };

  if (farm) filter.farm = farm;
  if (status) filter.healthStatus = status;

  const crops = await Crop.find(filter).populate('farm', 'name').sort({ plantingDate: -1 });
  res.json({ crops });
});

router.post('/', [
  body('farm').notEmpty(),
  body('cropName').notEmpty(),
  body('plantingDate').notEmpty(),
  body('expectedHarvestDate').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const farm = await Farm.findOne({ _id: req.body.farm, owner: req.user._id });
  if (!farm) return res.status(404).json({ message: 'Farm not found.' });

  const crop = await Crop.create({
    ...req.body,
    owner: req.user._id,
  });

  res.status(201).json({ crop });
});

router.put('/:id', async (req, res) => {
  const crop = await Crop.findOne({ _id: req.params.id, owner: req.user._id });
  if (!crop) return res.status(404).json({ message: 'Crop not found.' });

  const updated = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ crop: updated });
});

router.delete('/:id', async (req, res) => {
  const deleted = await Crop.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!deleted) return res.status(404).json({ message: 'Crop not found.' });

  res.json({ message: 'Crop deleted.' });
});

module.exports = router;
