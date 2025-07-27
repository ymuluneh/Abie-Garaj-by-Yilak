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
exports.getAllVehicles = async (search = "") => {
  try {
    let query = `
      SELECT
        cvi.vehicle_id,
        cvi.vehicle_year,
        cvi.vehicle_make,
        cvi.vehicle_model,
        cvi.vehicle_type,
        cvi.vehicle_mileage,
        cvi.vehicle_tag,
        cvi.vehicle_serial_number,
        cvi.vehicle_color,
        -- Select specific customer fields from joined tables
        ci.customer_first_name,
        ci.customer_last_name,
        cust_id.customer_email,
        cust_id.customer_phone_number
      FROM
        customer_vehicle_info AS cvi
      JOIN
        customer_identifier AS cust_id ON cvi.customer_id = cust_id.customer_id
      JOIN
        customer_info AS ci ON cust_id.customer_id = ci.customer_id
    `;
    const params = [];

    if (search) {
      // Add WHERE clause to filter by vehicle OR customer information
      query += `
        WHERE
            cvi.vehicle_make LIKE ?
            OR cvi.vehicle_model LIKE ?
            OR cvi.vehicle_tag LIKE ?
            OR cvi.vehicle_serial_number LIKE ?
            OR ci.customer_first_name LIKE ?
            OR ci.customer_last_name LIKE ?
            OR cust_id.customer_email LIKE ?
            OR cust_id.customer_phone_number LIKE ?
      `;
      const searchTermPattern = `%${search}%`;
      params.push(
        searchTermPattern,
        searchTermPattern,
        searchTermPattern,
        searchTermPattern,
        searchTermPattern,
        searchTermPattern,
        searchTermPattern,
        searchTermPattern
      );
    }

    query += ` ORDER BY cvi.vehicle_id DESC`; // Good practice to order results

    const [rows] = await pool.query(query, params);
    return rows; // This array of objects should now contain both vehicle and customer data
  } catch (error) {
    console.error("Error in getAllVehicles service:", error);
    throw new Error(`Failed to retrieve vehicles: ${error.message}`);
  }
};