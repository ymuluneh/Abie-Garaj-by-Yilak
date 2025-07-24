// routes/servicesRoute.js
const express = require("express");
const servicesRouter = express.Router();
const servicesController = require("../controllers/servicesController");
// Assuming you want to protect these routes

// GET all services (accessible by anyone, but good to have verifyToken for consistency)
servicesRouter.get(
  "/",
  
  servicesController.getAllServices
);

// GET a single service by ID
servicesRouter.get(
  "/:id",

  servicesController.getServiceById
);

// POST a new service (Admin only)
servicesRouter.post(
  "/",

  servicesController.createService
);

// PUT (update) an existing service (Admin only)
servicesRouter.put(
  "/:id",
 
  servicesController.updateService
);

// DELETE a service (Admin only - consider soft delete by updating an 'is_active' status instead)
servicesRouter.delete(
  "/:id",
 
  servicesController.deleteService
);

module.exports = servicesRouter;
