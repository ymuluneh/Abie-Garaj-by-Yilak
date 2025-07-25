// services/vehicle.service.js
const { pool } = require("../config/config"); // Adjust path if necessary

/**
 * Retrieves a single vehicle by its ID.
 * @param {number} vehicleId - The ID of the vehicle.
 * @returns {Promise<Object|null>} The vehicle object if found, otherwise null.
 */
exports.getVehicleById = async (vehicleId) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM customer_vehicle_info WHERE vehicle_id = ?",
      [vehicleId]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new Error(`Database error fetching vehicle by ID: ${error.message}`);
  }
};

/**
 * Adds a new vehicle to the database.
 * @param {object} vehicleData - Data for the new vehicle.
 * @returns {Promise<number>} The ID of the newly inserted vehicle.
 */
exports.addVehicle = async (vehicleData) => {
  const {
    customer_id,
    vehicle_year,
    vehicle_make,
    vehicle_model,
    vehicle_type,
    vehicle_mileage,
    vehicle_tag,
    vehicle_serial_number,
    vehicle_color,
  } = vehicleData;

  // Validate presence of required fields (though controller also does this)
  if (!customer_id || !vehicle_make || !vehicle_model) {
    throw new Error(
      "Missing required vehicle fields (customer_id, vehicle_make, vehicle_model)"
    );
  }
  if (vehicleData.vehicle_serial_number) {
    const [existingSerial] = await pool.query(
      "SELECT vehicle_id FROM customer_vehicle_info WHERE vehicle_serial_number = ?",
      [vehicleData.vehicle_serial_number]
    );
    if (existingSerial.length > 0) {
      throw new Error("A vehicle with this serial number already exists");
    }
  }

  // Check for duplicate license tag
  if (vehicleData.vehicle_tag) {
    const [existingTag] = await pool.query(
      "SELECT vehicle_id FROM customer_vehicle_info WHERE vehicle_tag = ?",
      [vehicleData.vehicle_tag]
    );
    if (existingTag.length > 0) {
      throw new Error("A vehicle with this license plate already exists");
    }
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO customer_vehicle_info (
        customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type,
        vehicle_mileage, vehicle_tag, vehicle_serial_number, vehicle_color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        vehicle_year || null, // Use null for optional fields if not provided
        vehicle_make,
        vehicle_model,
        vehicle_type || null,
        vehicle_mileage || null,
        vehicle_tag || null,
        vehicle_serial_number || null,
        vehicle_color || null,
      ]
    );
    return result.insertId; // Return the ID of the newly created vehicle
  } catch (error) {
    throw new Error(`Database error adding vehicle: ${error.message}`);
  }
};

/**
 * Updates an existing vehicle in the database.
 * @param {number} vehicleId - The ID of the vehicle to update.
 * @param {object} updateData - Data to update the vehicle with.
 * @returns {Promise<boolean>} True if updated successfully, false otherwise.
 */
exports.updateVehicle = async (vehicleId, updateData) => {
  const {
    vehicle_year,
    vehicle_make,
    vehicle_model,
    vehicle_type,
    vehicle_mileage,
    vehicle_tag,
    vehicle_serial_number,
    vehicle_color,
  } = updateData;

  try {
    const [result] = await pool.query(
      `UPDATE customer_vehicle_info SET
        vehicle_year = ?, vehicle_make = ?, vehicle_model = ?, vehicle_type = ?,
        vehicle_mileage = ?, vehicle_tag = ?, vehicle_serial_number = ?, vehicle_color = ?
      WHERE vehicle_id = ?`,
      [
        vehicle_year || null,
        vehicle_make,
        vehicle_model,
        vehicle_type || null,
        vehicle_mileage || null,
        vehicle_tag || null,
        vehicle_serial_number || null,
        vehicle_color || null,
        vehicleId,
      ]
    );
    return result.affectedRows > 0; // Returns true if a row was updated
  } catch (error) {
    throw new Error(`Database error updating vehicle: ${error.message}`);
  }
};

/**
 * Retrieves all vehicles associated with a specific customer.
 * @param {number} customerId - The ID of the customer.
 * @returns {Promise<Array<Object>>} An array of vehicle objects.
 */
exports.getVehiclesByCustomerId = async (customerId) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM customer_vehicle_info WHERE customer_id = ?",
      [customerId]
    );
    return rows;
  } catch (error) {
    throw new Error(
      `Database error fetching vehicles for customer: ${error.message}`
    );
  }
};

/**
 * Retrieves all vehicles from the database.
 * @returns {Promise<Array<Object>>} An array of all vehicle objects.
 */
exports.getAllVehicles = async () => {
  // NEW FUNCTION
  try {
    const [rows] = await pool.query("SELECT * FROM customer_vehicle_info");
    return rows;
  } catch (error) {
    throw new Error(`Database error fetching all vehicles: ${error.message}`);
  }
};
