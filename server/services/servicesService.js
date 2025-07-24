// services/servicesService.js
const { pool } = require("../config/config"); // Adjust path if your config.js is elsewhere

// Fetch all services from the database
const getServices = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT service_id, service_name, service_description FROM common_services"
    );
    return rows;
  } finally {
    connection.release();
  }
};

// Fetch a single service by its ID
const getServiceById = async (serviceId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT service_id, service_name, service_description FROM common_services WHERE service_id = ?",
      [serviceId]
    );
    return rows[0]; // Returns the first row if found, undefined otherwise
  } finally {
    connection.release();
  }
};

// Create a new service in the database
const createService = async (serviceName, serviceDescription) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "INSERT INTO common_services (service_name, service_description) VALUES (?, ?)",
      [serviceName, serviceDescription]
    );
    return result.insertId; // Returns the ID of the newly inserted service
  } finally {
    connection.release();
  }
};

// Update an existing service in the database
const updateService = async (serviceId, serviceName, serviceDescription) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "UPDATE common_services SET service_name = ?, service_description = ? WHERE service_id = ?",
      [serviceName, serviceDescription, serviceId]
    );
    return result.affectedRows > 0; // Returns true if a row was updated, false otherwise
  } finally {
    connection.release();
  }
};

// Delete a service from the database
const deleteService = async (serviceId) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "DELETE FROM common_services WHERE service_id = ?",
      [serviceId]
    );
    return result.affectedRows > 0; // Returns true if a row was deleted, false otherwise
  } finally {
    connection.release();
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
