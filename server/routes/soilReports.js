const express = require('express');
const { body, validationResult } = require('express-validator');
const SoilReport = require('../models/SoilReport');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

const getRecommendations = (report) => {
  const recs = [];
  if (report.pH < 6 || report.pH > 7.5) recs.push('Adjust pH to the agronomic range of 6.0-7.5 for most crops.');
  if (report.nitrogen < 25) recs.push('Add a nitrogen-rich organic amendment to support vegetative growth.');
  if (report.phosphorus < 15) recs.push('Apply phosphate fertilizer to improve root establishment.');
  if (report.potassium < 150) recs.push('Increase potassium input to strengthen stress tolerance.');
  if (report.moisture < 20) recs.push('Improve irrigation scheduling to prevent water stress.');
  if (report.organicMatter < 2) recs.push('Add compost to improve soil structure and microbial activity.');

  return recs.length ? recs.join(' ') : 'Soil metrics are within the general agronomic range.';
};

router.get('/', async (req, res) => {
  const reports = await SoilReport.find({ owner: req.user._id }).populate('farm', 'name').populate('crop', 'cropName').sort({ testDate: -1 });
  res.json({ reports });
});

router.post('/', [
  body('farm').notEmpty(),
  body('pH').isFloat({ min: 3, max: 10 }),
  body('nitrogen').isFloat({ min: 0, max: 200 }),
  body('phosphorus').isFloat({ min: 0, max: 200 }),
  body('potassium').isFloat({ min: 0, max: 500 }),
  body('moisture').isFloat({ min: 0, max: 100 }),
  body('organicMatter').isFloat({ min: 0, max: 20 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const report = await SoilReport.create({
    ...req.body,
    owner: req.user._id,
    recommendations: getRecommendations(req.body),
  });

  res.status(201).json({ report });
});

module.exports = router;
