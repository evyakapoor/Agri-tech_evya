const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const { seedDemoData } = require('./utils/seed');
const authRoutes = require('./routes/auth');
const farmRoutes = require('./routes/farms');
const cropRoutes = require('./routes/crops');
const soilRoutes = require('./routes/soilReports');
const weatherRoutes = require('./routes/weather');
const resourceRoutes = require('./routes/resources');
const dashboardRoutes = require('./routes/dashboard');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Agri-Tech API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/soil-reports', soilRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.', error: err.message });
});

async function startServer() {
  await connectDB();
  if (global.__MONGO_READY__) {
    await seedDemoData();
  }
  return app.listen(PORT, () => {
    console.log(`Agri-Tech server running on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
