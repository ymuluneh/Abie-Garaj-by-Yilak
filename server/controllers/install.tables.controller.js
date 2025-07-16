//import install tables service
const createTables = require("../services/createTablesSevice");

const createTablesController = async (req, res) => {
  try {
    // Call the service to create tables
    await createTables.createTables();

    res.status(201).json({ message: "Tables created successfully" });
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    res.status(500).json({ message: "Server error while creating tables" });
  }
};
module.exports = { createTablesController };
