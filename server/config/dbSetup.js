const mysql = require("mysql2/promise");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

async function createSchema() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
    });

    const schemaSQL = fs.readFileSync(
      path.join(__dirname, "schema.sql"),
      "utf8"
    );

    await connection.query(schemaSQL);
    console.log("✅ Database and tables created or verified.");
    await connection.end();
  } catch (error) {
    console.error("❌ Error creating schema:", error);
  }
}

module.exports = createSchema;
