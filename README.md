# CSV to JSON Converter API

This is a Node.js (Express) backend project. It parses a CSV file with nested dot-notation keys, converts it into structured JSON, stores the data into a PostgreSQL database, and prints age group distribution statistics.

🧰 Features
- ✅ Convert CSV rows into nested JSON
- ✅ Handle dot-separated complex properties (a.b.c)
- ✅ Store structured data into PostgreSQL (JSONB fields)
- ✅ Categorize and display age group distribution
- ✅ Lightweight health check endpoint
- ✅ Configurable via .env

📁 Project Structure
```
csv-json-converter/
│
├── config/
│   └── db.js               # PostgreSQL DB connection
│
├── controllers/
│   └── csvController.js    # Core logic to process CSV, insert into DB
│
├── utils/
│   └── parser.js           # Converts flat keys to nested JSON
│
├── data/
│   └── users.csv           # Your test CSV file
│
├── .env                    # Environment config
├── index.js                # Express entry point
├── schema.sql              # PostgreSQL schema for `users` table
└── README.md
```

🚀 Getting Started

1. Clone the Repository
```
git clone {{path}}/csv-json-converter.git
cd csv-json-converter
```
2. Install Dependencies
```
npm install
```
3. Setup .env
Create a .env file in the root:
```
CSV_FILE_PATH=./data/users.csv
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=kelpdb
```

4. Create a PostgreSQL Table

Ensure your database is running, then execute the SQL in schema.sql:
```
CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  age INT NOT NULL,
  address JSONB,
  additional_info JSONB
);
```

5. Run the Server
```
node index.js
```

## API Endpoints

GET /health
Returns a simple health status.

GET /process-csv
- Parses the CSV file defined in CSV_FILE_PATH
- Converts each row into structured JSON
- Inserts valid data into PostgreSQL
- Logs age group distribution
- Returns the parsed JSON in response
- 📊 Age Group Distribution (Console Output)

## Assumptions
- The first line of CSV is always the header
- Mandatory fields: name.firstName, name.lastName, age
- Properties with dot notation can have infinite nesting
- All unmapped fields are stored in the additionalInfo JSONB column
