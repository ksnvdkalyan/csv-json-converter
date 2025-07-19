const fs = require('fs');
const csv = require('csv-parser');
const pool = require('../config/db');
const buildNestedObject = require('../utils/parser');
require('dotenv').config();

/**
 * Tracks age group counts for distribution analysis
 */
const ageGroups = {
  '<20': 0,
  '20-40': 0,
  '40-60': 0,
  '>60': 0,
};

/**
 * @function processCSV
 * @description Reads CSV from configured path, converts rows to nested JSON,
 *              inserts valid records into PostgreSQL, computes age-group stats,
 *              and returns the parsed records in the HTTP response.
 * @param {import('express').Request} req - Express Request Object
 * @param {import('express').Response} res - Express Response Object
 * @returns {Promise<void>}
 */
async function processCSV(req, res) {
  const results = [];

  // Stream the CSV file and collect rows into `results`
  fs.createReadStream(process.env.CSV_FILE_PATH)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      const jsonResponse = [];

      // Process each row
      for (let row of results) {
        // Convert flat keys (a.b.c) into nested object
        const nested = buildNestedObject(row);

        // Extract mandatory fields
        const firstName = nested.name?.firstName || '';
        const lastName = nested.name?.lastName || '';
        const age = parseInt(nested.age, 10);
        const gender = nested.gender || null;

        // Prepare a deep clone of the nested object to filter additionalInfo
        const additionalInfo = JSON.parse(JSON.stringify(nested));

        // Remove mandatory and known fields from additionalInfo
        if (additionalInfo.name) {
          delete additionalInfo.name.firstName;
          delete additionalInfo.name.lastName;
          if (Object.keys(additionalInfo.name).length === 0) delete additionalInfo.name;
        }
        delete additionalInfo.age;
        delete additionalInfo.gender;

        const address = nested.address || null;
        delete additionalInfo.address;

        // Insert into PostgreSQL DB
        await pool.query(
          `INSERT INTO users(name, age, address, additionalInfo) VALUES($1, $2, $3, $4)`,
          [
            { firstName, lastName }, // keeping name as nested object
            age,
            address,
            Object.keys(additionalInfo).length > 0 ? additionalInfo : null,
          ]
        );

        // Age group classification
        if (age < 20) ageGroups['<20']++;
        else if (age <= 40) ageGroups['20-40']++;
        else if (age <= 60) ageGroups['40-60']++;
        else ageGroups['>60']++;

        // Push cleaned and structured object to response array
        jsonResponse.push({
          name: { firstName, lastName },
          age,
          gender,
          address,
          additionalInfo: Object.keys(additionalInfo).length > 0 ? additionalInfo : null,
        });
      }

      // Compute and log age distribution report
      const total = Object.values(ageGroups).reduce((a, b) => a + b, 0);
      console.log('\nAge-Group % Distribution');
      for (let group in ageGroups) {
        const percent = ((ageGroups[group] / total) * 100).toFixed(2);
        console.log(`${group}: ${percent}%`);
      }

      // Send HTTP response
      res.status(200).json({
        message: 'CSV processed and inserted into DB.',
        records: jsonResponse,
      });
    });
}

module.exports = processCSV;