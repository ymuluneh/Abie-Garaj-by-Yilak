const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// GET /api/customers - Get paginated list of customers
router.get("/", customerController.getCustomers);

// GET /api/customer/:id - Get single customer by ID
router.get("/:id", customerController.getCustomer);

// POST /api/customer - Create a new customer
router.post("/", customerController.addCustomer);

// PUT /api/customer/:id - Update customer
router.put("/:id", customerController.updateCustomer);

// GET /api/customer/:id/vehicles - Get vehicles per customer
// router.get("/:id/vehicles", customerController.getCustomerVehicles);

module.exports = router;
