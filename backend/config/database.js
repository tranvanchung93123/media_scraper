require('dotenv').config();
const { Sequelize } = require('sequelize');
const { Client } = require('pg');

// Define database credentials
const {
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_PORT
} = process.env;

// Function to create the database if it doesn't exist
const ensureDatabaseExists = async () => {
  const client = new Client({
    user: DB_USER,
    password: DB_PASS,
    host: DB_HOST,
    port: DB_PORT,
    database: 'postgres', // Default database for administrative tasks
  });

  try {
    await client.connect();
    const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [DB_NAME]);
    if (result.rowCount === 0) {
      console.log(`Database "${DB_NAME}" does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Database "${DB_NAME}" created successfully.`);
    } else {
      console.log(`Database "${DB_NAME}" already exists.`);
    }
  } catch (error) {
    console.error('Error checking/creating database:', error.message);
    throw error;
  } finally {
    await client.end();
  }
};

// Initialize Sequelize instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
});

// Ensure the database exists before starting the app
(async () => {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
})();

module.exports = sequelize;
