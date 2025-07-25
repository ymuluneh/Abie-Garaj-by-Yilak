// controllers/customer.controller.js
const customerService = require("../services/customerService");

exports.createCustomer = async (req, res) => {
  try {
    const customerId = await customerService.createCustomer(req.body);
    res.status(201).json({ customerId, message: "Customer created successfully." });
  } catch (error) {
    console.error("Error in createCustomer controller:", error);
    res.status(500).json({ error: error.message, message: "Failed to create customer." });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortby, search } = req.query;
    const { total, customers } = await customerService.getCustomers(
      parseInt(page),
      parseInt(limit),
      sortby,
      search
    );

 

    res.json({
      success: true,
      data: { customers, total }, // Ensure this structure matches what frontend expects
    });
  } catch (error) {
    console.error("Error in getCustomers controller:", error);
    res.status(500).json({ error: error.message, message: "Failed to fetch customers." });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    console.error(`Error in getCustomerById controller for ID ${req.params.id}:`, error);
    res.status(500).json({ error: error.message, message: "Failed to fetch customer details." });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const updated = await customerService.updateCustomer(req.params.id, {
      phone: req.body.phone,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      activeStatus: req.body.activeStatus,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Customer not found or no changes made." });
    }

    res.json({ success: true, message: "Customer updated successfully." });
  } catch (error) {
    console.error(
      `Error in updateCustomer controller for ID ${req.params.id}:`,
      error
    );
    res.status(500).json({
      error: error.message,
      message: "Failed to update customer.",
    });
  }
};
