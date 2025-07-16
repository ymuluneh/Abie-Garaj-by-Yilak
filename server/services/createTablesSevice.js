// services/createTablesSevice.js
const fs = require("fs").promises;
const path = require("path");
const { pool } = require("../config/config");

const createTables = async () => {
  try {
    const sqlFilePath = path.join(__dirname, "tables.sql");

    // Read the SQL file content
    const sql = await fs.readFile(sqlFilePath, "utf8");

    // Split the SQL commands and execute one by one
    const queries = sql.split(/;\s*$/m).filter((q) => q.trim()); // Remove empty queries

    for (const query of queries) {
      await pool.query(query);
    }

    console.log("✅ Tables created successfully.");
  } catch (error) {
    console.error("❌ Error creating tables:", error.message);
    throw error;
  }
};

module.exports = { createTables };
