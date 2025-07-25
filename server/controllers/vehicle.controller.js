// controllers/vehicle.controller.js
const vehicleService = require("../services/vehicle.service");

/**
 * Get a single vehicle by ID.
 * GET /api/vehicle/:id
 */
exports.getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await vehicleService.getVehicleById(id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Format the response to match the API documentation
    res.json({
      vehicle_id: vehicle.vehicle_id,
      customer_id: vehicle.customer_id,
      vehicle_year: vehicle.vehicle_year,
      vehicle_make: vehicle.vehicle_make,
      vehicle_model: vehicle.vehicle_model,
      vehicle_type: vehicle.vehicle_type,
      vehicle_mileage: vehicle.vehicle_mileage,
      vehicle_tag: vehicle.vehicle_tag,
      vehicle_serial_number: vehicle.vehicle_serial_number,
      vehicle_color: vehicle.vehicle_color,
    });
  } catch (error) {
    console.error("Error in getVehicleById:", error.message);
    res.status(500).json({ error: "Failed to fetch vehicle" });
  }
};

/**
 * Add a new vehicle.
 * POST /api/vehicle
 */
exports.addVehicle = async (req, res) => {
  try {
    const {
      customer_id, // This is mandatory
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_serial_number,
      vehicle_color,
    } = req.body;

    // Basic validation for required fields
    if (!customer_id || !vehicle_make || !vehicle_model) {
      return res.status(400).json({
        message:
          "Missing required fields (customer_id, vehicle_make, vehicle_model)",
      });
    }

    const newVehicleId = await vehicleService.addVehicle({
      customer_id,
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_serial_number,
      vehicle_color,
    });

    res.status(201).json({ success: true, vehicle_id: newVehicleId });
  } catch (error) {
    console.error("Error in addVehicle:", error.message);
    // More specific error handling for duplicate serial numbers, etc.
    if (error.message.includes("Duplicate entry")) {
      return res.status(409).json({
        message: "Vehicle already exists or has a duplicate serial number/tag.",
      });
    }
    res.status(500).json({ error: "Failed to add vehicle" });
  }
};

/**
 * Update an existing vehicle.
 * PUT /api/vehicle
 */
exports.updateVehicle = async (req, res) => {
  try {
    const {
      vehicle_id, // This is mandatory for update
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_serial_number,
      vehicle_color,
    } = req.body;

    // Basic validation
    if (!vehicle_id || !vehicle_make || !vehicle_model) {
      return res.status(400).json({
        message:
          "Missing required fields (vehicle_id, vehicle_make, vehicle_model)",
      });
    }

    const updated = await vehicleService.updateVehicle(vehicle_id, {
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_serial_number,
      vehicle_color,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Vehicle not found or no changes made" });
    }

    res.json({ success: true, message: "Vehicle updated successfully" });
  } catch (error) {
    console.error("Error in updateVehicle:", error.message);
    res.status(500).json({ error: "Failed to update vehicle" });
  }
};

/**
 * Get all vehicles for a specific customer.
 * GET /api/vehicle/customer/:customer_id
 */
exports.getVehiclesByCustomerId = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const vehicles = await vehicleService.getVehiclesByCustomerId(customer_id);

    // As per your API docs, the response should include customer_id at the top level,
    // and then an array of vehicle objects.
    res.json({
      customer_id: parseInt(customer_id),
      vehicles: vehicles.map((v) => ({
        // Map to match output format
        vehicle_id: v.vehicle_id,
        customer_id: v.customer_id,
        vehicle_year: v.vehicle_year,
        vehicle_make: v.vehicle_make,
        vehicle_model: v.vehicle_model,
        vehicle_type: v.vehicle_type,
        vehicle_mileage: v.vehicle_mileage,
        vehicle_tag: v.vehicle_tag,
        vehicle_serial_number: v.vehicle_serial_number,
        vehicle_color: v.vehicle_color,
      })),
    });
  } catch (error) {
    console.error("Error in getVehiclesByCustomerId:", error.message);
    res.status(500).json({ error: "Failed to fetch customer vehicles" });
  }
};

/**
 * Get all vehicles.
 * GET /api/vehicle/all
 */
exports.getAllVehicles = async (req, res) => {
  // NEW CONTROLLER FUNCTION
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    console.error("Error in getAllVehicles:", error.message);
    res.status(500).json({ error: "Failed to fetch all vehicles" });
  }
};
