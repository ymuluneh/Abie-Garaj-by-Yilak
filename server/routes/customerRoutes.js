const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const customerService = require("../services/customerService"); // Ensure this is imported for the /all route

// POST /api/customer - Create a new customer
router.post("/", customerController.createCustomer);

// GET /api/customer/all - Get all customers (MUST be before /:id)
router.get("/all", async (req, res) => {
  try {
    const result = await customerService.getCustomers(
      1,
      10000, // Large limit to get all
      "customer_added_date",
      ""
    );
    res.json(result.customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/customers - Get paginated list of customers
router.get("/", customerController.getCustomers);

// GET /api/customer/:id - Get single customer by ID
router.get("/:id", customerController.getCustomerById);

// PUT /api/customer/:id - Update customer
router.put("/:id", customerController.updateCustomer);

// GET /api/customer/:id/vehicles - Get vehicles per customer (uncomment if you have this controller function)
// router.get("/:id/vehicles", customerController.getCustomerVehicles);

module.exports = router;
