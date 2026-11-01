const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilReport = require('../models/SoilReport');
const WeatherRecord = require('../models/WeatherRecord');
const PestAlert = require('../models/PestAlert');
const Resource = require('../models/Resource');
const Order = require('../models/Order');
const Consultation = require('../models/Consultation');
const CommunityPost = require('../models/CommunityPost');
const FarmActivity = require('../models/FarmActivity');
const Notification = require('../models/Notification');

async function seedDemoData() {
  if (global.__MONGO_READY__ === false || !require('mongoose').connection.readyState) {
    return;
  }

  const adminEmail = 'admin@agritech.com';
  const farmerEmail = 'farmer@agritech.com';

  const adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) {
    const hash = await bcrypt.hash('Admin@123', 10);
    await User.create({
      name: 'Agri Admin',
      email: adminEmail,
      password: hash,
      phone: '+91 9876543210',
      role: 'admin',
      preferredLanguage: 'en',
      location: 'Nagpur',
    });
  }

  const farmerUser = await User.findOne({ email: farmerEmail });
  if (!farmerUser) {
    const hash = await bcrypt.hash('Farmer@123', 10);
    await User.create({
      name: 'Priya Sharma',
      email: farmerEmail,
      password: hash,
      phone: '+91 9123456789',
      role: 'farmer',
      preferredLanguage: 'hi',
      location: 'Pune',
    });
  }

  const admin = await User.findOne({ email: adminEmail });
  const user = await User.findOne({ email: farmerEmail });

  if (admin && !(await Farm.exists({ owner: admin._id }))) {
    const farm = await Farm.create({
      owner: admin._id,
      name: 'Green Valley Orchard',
      address: 'Wardha Road, Nagpur',
      region: 'Vidarbha',
      coordinates: { lat: 21.1466, lng: 79.0882 },
      totalArea: 28,
      areaUnit: 'acre',
      soilType: 'Clay loam',
      irrigationMethod: 'Sprinkler',
    });

    const crop = await Crop.create({
      owner: admin._id,
      farm: farm._id,
      cropName: 'Tomato',
      variety: 'Heirloom',
      plantingDate: new Date('2025-08-01'),
      expectedHarvestDate: new Date('2025-12-15'),
      fieldArea: 10,
      growthStage: 'Fruiting',
      healthStatus: 'Healthy',
      notes: 'Strong flowering cycle with regular irrigation.',
    });

    await SoilReport.create({
      owner: admin._id,
      farm: farm._id,
      crop: crop._id,
      source: 'Laboratory',
      pH: 6.4,
      nitrogen: 36,
      phosphorus: 18,
      potassium: 210,
      moisture: 28,
      organicMatter: 2.7,
      recommendations: 'Apply compost and maintain drip irrigation to prevent nutrient leaching.',
    });

    await WeatherRecord.create({
      owner: admin._id,
      farm: farm._id,
      location: 'Nagpur',
      temperature: 29.5,
      humidity: 72,
      rainfall: 18,
      windSpeed: 9.4,
      forecastTimestamp: new Date(),
      provider: 'OpenWeather',
      freshness: 'live',
    });

    await PestAlert.create({
      owner: admin._id,
      farm: farm._id,
      crop: crop._id,
      name: 'Leaf curl virus',
      severity: 'Medium',
      description: 'Localized symptoms observed in the western block.',
      recommendedActions: 'Increase spacing and remove infected stems for sanitation.',
      status: 'Monitoring',
      source: 'Field scout',
    });

    await FarmActivity.create({
      farm: farm._id,
      user: admin._id,
      activityType: 'Irrigation',
      description: 'Scheduled drip irrigation completed for the main tomato block.',
      date: new Date(),
    });

    await Notification.create({
      user: admin._id,
      title: 'Season update',
      message: 'Tomato crop is in fruiting stage with healthy nutrient balance.',
      type: 'success',
      read: false,
    });
  }

  if (user && !(await Farm.exists({ owner: user._id }))) {
    const farm = await Farm.create({
      owner: user._id,
      name: 'Sunrise Farm',
      address: 'Haveli, Pune',
      region: 'Western Maharashtra',
      coordinates: { lat: 18.5204, lng: 73.8567 },
      totalArea: 15,
      areaUnit: 'acre',
      soilType: 'Sandy loam',
      irrigationMethod: 'Drip',
    });

    const crop = await Crop.create({
      owner: user._id,
      farm: farm._id,
      cropName: 'Rice',
      variety: 'Swarna',
      plantingDate: new Date('2025-07-10'),
      expectedHarvestDate: new Date('2025-11-15'),
      fieldArea: 6,
      growthStage: 'Vegetative',
      healthStatus: 'Monitoring',
      notes: 'Needs more nitrogen after early rainfall.',
    });

    await SoilReport.create({
      owner: user._id,
      farm: farm._id,
      crop: crop._id,
      source: 'Manual',
      pH: 5.9,
      nitrogen: 48,
      phosphorus: 20,
      potassium: 180,
      moisture: 30,
      organicMatter: 1.8,
      recommendations: 'Add sulfur and nitrogen-rich top dressing to improve growth potential.',
    });

    await WeatherRecord.create({
      owner: user._id,
      farm: farm._id,
      location: 'Pune',
      temperature: 27.3,
      humidity: 76,
      rainfall: 12,
      windSpeed: 7.5,
      forecastTimestamp: new Date(),
      provider: 'OpenWeather',
      freshness: 'live',
    });

    await PestAlert.create({
      owner: user._id,
      farm: farm._id,
      crop: crop._id,
      name: 'Brown plant hopper',
      severity: 'High',
      description: 'Frequent pest activity near the lower plateau.',
      recommendedActions: 'Use neem foliar spray and release beneficial predators if threshold rises.',
      status: 'Open',
      source: 'Agro support team',
    });

    await Resource.create({
      name: 'Bio-pesticide kit',
      category: 'Protection',
      description: 'OMRI-listed biological spray for crop protection.',
      price: 540,
      stockQuantity: 12,
      imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa52ac9fcf0d',
      approvalStatus: 'Approved',
      creator: user._id,
    });

    await Order.create({
      user: user._id,
      items: [{ name: 'Bio-pesticide kit', quantity: 1, price: 540 }],
      total: 540,
      status: 'Pending',
      deliveryDetails: 'Pune delivery hub',
    });

    await Consultation.create({
      farmer: user._id,
      subject: 'Nitrogen deficiency',
      question: 'What is the best schedule to correct nitrogen deficiency in rice seedlings?',
      response: 'Apply a split-dose nitrogen plan and target light irrigation after application.',
      status: 'Answered',
    });

    await CommunityPost.create({
      author: user._id,
      title: 'Water-saving tip',
      content: 'We are using mulching and drip lines to preserve moisture during dry spells.',
      category: 'Tips',
      comments: [{ message: 'Useful advice for new growers.' }],
      moderationStatus: 'Approved',
    });

    await FarmActivity.create({
      farm: farm._id,
      user: user._id,
      activityType: 'Crop inspection',
      description: 'Field inspection and crop health review performed for rice plots.',
      date: new Date(),
    });

    await Notification.create({
      user: user._id,
      title: 'Pest alert',
      message: 'Brown plant hopper detected in lower plateau; monitor crop daily.',
      type: 'warning',
      read: false,
    });
  }
}

module.exports = { seedDemoData };
