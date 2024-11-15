// app.js
const express = require('express');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');
const logger = require('./middleware/logger');
const errorHandling = require('./middleware/errorHandling');
const mediaRoutes = require('./routes/mediaRoutes');
const sequelize = require('./config/database'); // Import the Sequelize instance

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(authMiddleware);

// Routes
app.use('/api/media', mediaRoutes);

// Error handling
app.use(errorHandling);

// Ensure models are synchronized after the database is ready
sequelize
  .sync()
  .then(() => {
    console.log('Models synchronized successfully.');
  })
  .catch((err) => {
    console.error('Error initializing database:', err.message);
    process.exit(1); // Exit the process if database initialization fails
  });

module.exports = app;
