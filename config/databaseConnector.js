const { Pool } = require('pg');
require('dotenv').config();

/**
 * PostgreSQL pool instance using environment config.
 * Reads DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME from `.env`.
 */
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Optional: Log successful DB connection during app startup
pool.connect()
  .then(client => {
    console.log('Connected to PostgreSQL');
    client.release(); // Release the test client immediately
  })
  .catch(err => {
    console.error('Error connecting to PostgreSQL:', err.message);
  });

module.exports = pool;