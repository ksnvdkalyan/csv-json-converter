const express = require('express');
const dotenv = require('dotenv');
const processCSV = require('./controller/csvController');

dotenv.config();
const app = express();

// Health check endpoint
/**
 * @route GET /health
 * @description Returns server status for health checks
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// CSV processing route
app.get('/process-csv', processCSV);

// Start the server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});