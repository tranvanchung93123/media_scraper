// app.js
const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger'); // Middleware for logging
const authMiddleware = require('./middleware/authMiddleware'); // Middleware for authentication
const errorHandling = require('./middleware/errorHandling'); // Middleware for error handling
const mediaRoutes = require('./routes/mediaRoutes'); // Routes
const sequelize = require('./config/database'); // Sequelize instance

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger); // Log requests
app.use(authMiddleware); // Authenticate requests

// Routes
app.use('/api', mediaRoutes);

// Error Handling Middleware
app.use(errorHandling);

// Handle CORS Pre-flight Requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  next();
});

// Synchronize Database
sequelize
  .sync({ alter: true }) // Use `alter` to update schema without dropping data
  .then(() => {
    console.log('Database and models synchronized successfully.');
  })
  .catch((err) => {
    console.error('Error synchronizing the database:', err.message);
    process.exit(1); // Exit the process if database initialization fails
  });

module.exports = app;
