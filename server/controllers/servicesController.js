// controllers/servicesController.js
const servicesService = require("../services/servicesService");

// Get all services
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

// Get a single service by ID
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
    const { service_name, service_description } = req.body;
    if (!service_name) {
      return res
        .status(400)
        .json({ status: "fail", message: "Service name is required." });
    }
    const newServiceId = await servicesService.createService(
      service_name,
      service_description
    );
    res
      .status(201)
      .json({
        status: "success",
        service_id: newServiceId,
        message: "Service created successfully.",
      });
  } catch (error) {
    console.error("Error in createService:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to create service." });
  }
};

// Update an existing service
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { service_name, service_description } = req.body;
    const success = await servicesService.updateService(
      id,
      service_name,
      service_description
    );
    if (!success) {
      return res
        .status(404)
        .json({
          status: "fail",
          message: "Service not found or no changes made.",
        });
    }
    res
      .status(200)
      .json({ status: "success", message: "Service updated successfully." });
  } catch (error) {
    console.error("Error in updateService:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to update service." });
  }
};

// Delete a service (consider soft delete in real applications)
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await servicesService.deleteService(id);
    if (!success) {
      return res
        .status(404)
        .json({ status: "fail", message: "Service not found." });
    }
    res
      .status(200)
      .json({ status: "success", message: "Service deleted successfully." });
  } catch (error) {
    console.error("Error in deleteService:", error);
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
