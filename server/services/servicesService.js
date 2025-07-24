// services/servicesService.js
const { pool } = require("../config/config"); // Adjust path if your config.js is elsewhere

// Fetch all ACTIVE services from the database, including price
const getServices = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT service_id, service_name, service_description, service_price FROM common_services WHERE is_active = 1" // Fetch active services and price
    );
    return rows;
  } finally {
    connection.release();
  }
};

// Fetch a single service by its ID, including price
const getServiceById = async (serviceId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT service_id, service_name, service_description, service_price, is_active FROM common_services WHERE service_id = ?",
      [serviceId]
    );
    return rows[0]; // Returns the first row if found, undefined otherwise
  } finally {
    connection.release();
  }
};

// Create a new service in the database, now accepting price
const createService = async (serviceName, serviceDescription, servicePrice) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "INSERT INTO common_services (service_name, service_description, service_price, is_active) VALUES (?, ?, ?, 1)", // Default to active
      [serviceName, serviceDescription, servicePrice]
    );
    return result.insertId; // Returns the ID of the newly inserted service
  } finally {
    connection.release();
  }
};

// Update an existing service in the database, now accepting price
const updateService = async (
  serviceId,
  serviceName,
  serviceDescription,
  servicePrice
) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "UPDATE common_services SET service_name = ?, service_description = ?, service_price = ? WHERE service_id = ?",
      [serviceName, serviceDescription, servicePrice, serviceId]
    );
    return result.affectedRows > 0; // Returns true if a row was updated, false otherwise
  } finally {
    connection.release();
  }
};

// Soft delete a service from the database (mark as inactive)
const deleteService = async (serviceId) => {
  const connection = await pool.getConnection();
  try {
    // Check if the service is referenced in order_services
    const [referenced] = await connection.query(
      "SELECT COUNT(*) AS count FROM order_services WHERE service_id = ?",
      [serviceId]
    );

    if (referenced[0].count > 0) {
      // If referenced, perform soft delete (set is_active to 0)
      const [result] = await connection.query(
        "UPDATE common_services SET is_active = 0 WHERE service_id = ?",
        [serviceId]
      );
      // Return true if a row was updated (i.e., successfully soft-deleted)
      return result.affectedRows > 0;
    } else {
      // If not referenced, perform hard delete
      const [result] = await connection.query(
        "DELETE FROM common_services WHERE service_id = ?",
        [serviceId]
      );
      // Return true if a row was deleted (i.e., successfully hard-deleted)
      return result.affectedRows > 0;
    }
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
