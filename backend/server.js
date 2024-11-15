// server.js
const app = require('./app'); // Import the app
const sequelize = require('./config/database'); // Import Sequelize instance

(async () => {
  try {
    // Ensure database connection is healthy
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Start the server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Error starting the server:', error.message);
    process.exit(1); // Exit the process if the server fails to start
  }
})();
