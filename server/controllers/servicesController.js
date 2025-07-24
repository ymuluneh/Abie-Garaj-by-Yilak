// controllers/servicesController.js
const servicesService = require("../services/servicesService");

// Get all active services
const getAllServices = async (req, res) => {
  try {
    const services = await servicesService.getServices();
    res.status(200).json(services);
  } catch (error) {
    console.error("Error in getAllServices:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch services." });
  }
};

// Get a single service by ID (can fetch active or inactive)
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await servicesService.getServiceById(id);
    if (!service) {
      return res
        .status(404)
        .json({ status: "fail", message: "Service not found." });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error("Error in getServiceById:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch service." });
  }
};

// Create a new service
const createService = async (req, res) => {
  try {
    const { service_name, service_description, service_price } = req.body; // Destructure service_price
    if (
      !service_name ||
      !service_description ||
      service_price === undefined ||
      service_price === null
    ) {
      return res
        .status(400)
        .json({
          status: "fail",
          message: "All fields (Name, Description, Price) are required.",
        });
    }
    // Validate price to be a valid number
    const price = parseFloat(service_price);
    if (isNaN(price) || price < 0) {
      return res
        .status(400)
        .json({
          status: "fail",
          message: "Service price must be a valid non-negative number.",
        });
    }

    const newServiceId = await servicesService.createService(
      service_name,
      service_description,
      price // Pass the parsed price
    );
    res.status(201).json({
      status: "success",
      service_id: newServiceId,
      message: "Service created successfully.",
    });
  } catch (error) {
    console.error("Error in createService:", error);
    // Be more specific about unique constraint errors if needed
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({
          status: "fail",
          message: "Service with this name already exists.",
        });
    }
    res
      .status(500)
      .json({ status: "error", message: "Failed to create service." });
  }
};

// Update an existing service
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { service_name, service_description, service_price } = req.body; // Destructure service_price

    // Basic validation
    if (
      !service_name ||
      !service_description ||
      service_price === undefined ||
      service_price === null
    ) {
      return res
        .status(400)
        .json({
          status: "fail",
          message:
            "All fields (Name, Description, Price) are required for update.",
        });
    }
    const price = parseFloat(service_price);
    if (isNaN(price) || price < 0) {
      return res
        .status(400)
        .json({
          status: "fail",
          message: "Service price must be a valid non-negative number.",
        });
    }

    const success = await servicesService.updateService(
      id,
      service_name,
      service_description,
      price // Pass the parsed price
    );
    if (!success) {
      return res.status(404).json({
        status: "fail",
        message: "Service not found or no changes made.",
      });
    }
    res
      .status(200)
      .json({ status: "success", message: "Service updated successfully." });
  } catch (error) {
    console.error("Error in updateService:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({
          status: "fail",
          message: "Another service with this name already exists.",
        });
    }
    res
      .status(500)
      .json({ status: "error", message: "Failed to update service." });
  }
};

// Delete (soft delete) a service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await servicesService.deleteService(id);
    if (!success) {
      return res
        .status(404)
        .json({
          status: "fail",
          message: "Service not found or already inactive.",
        });
    }
    res
      .status(200)
      .json({
        status: "success",
        message: "Service deleted (marked inactive) successfully.",
      });
  } catch (error) {
    console.error("Error in deleteService:", error);
    // This error handling here covers cases where the service might be referenced
    // but the soft delete still fails for some other reason, or a hard delete fails.
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res
        .status(409)
        .json({
          status: "fail",
          message:
            "Cannot delete this service directly as it's linked to existing orders. It has been marked as inactive instead.",
        });
    }
    res
      .status(500)
      .json({ status: "error", message: "Failed to delete service." });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
