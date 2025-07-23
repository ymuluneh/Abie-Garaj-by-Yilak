const customerService = require("../services/customerService");
// const vehicleService = require("../services/vehicleService");

exports.getCustomers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortby = "customer_added_date",
      search = "",
    } = req.query;

    const result = await customerService.getCustomers(
      parseInt(page),
      parseInt(limit),
      sortby,
      search
    );

    res.json({
      limit: parseInt(limit),
      customers: result.customers,
      total: result.total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);

    res.json({
      customer_id: customer.customer_id,
      customer_email: customer.customer_email,
      customer_phone_number: customer.customer_phone_number,
      customer_first_name: customer.customer_first_name,
      customer_last_name: customer.customer_last_name,
      customer_hash: customer.customer_hash || "",
      active_customer_status: customer.customer_active_status,
      customer_added_date: customer.customer_added_date,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.addCustomer = async (req, res) => {
  try {
    const {
      customer_email,
      customer_phone_number,
      customer_first_name,
      customer_last_name,
      customer_hash = "",
      active_customer_status = 1,
      customer_added_date = new Date(),
    } = req.body;

    if (
      !customer_email ||
      !customer_phone_number ||
      !customer_first_name ||
      !customer_last_name
    ) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const customerId = await customerService.createCustomer({
      email: customer_email,
      phone: customer_phone_number,
      firstName: customer_first_name,
      lastName: customer_last_name,
      hash: customer_hash,
      activeStatus: active_customer_status,
      addedDate: customer_added_date,
    });

    res.status(201).json({
      success: true,
      customerId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer_phone_number,
      customer_first_name,
      customer_last_name,
      active_customer_status,
    } = req.body;

    await customerService.updateCustomer(id, {
      phone: customer_phone_number,
      firstName: customer_first_name,
      lastName: customer_last_name,
      activeStatus: active_customer_status,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getVehiclesByCustomerId(
      req.params.id
    );
    res.json({
      customer_id: parseInt(req.params.id),
      vehicles: vehicles,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

