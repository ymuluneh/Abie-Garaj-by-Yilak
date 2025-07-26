// order.controller.js
const orderService = require("../services/order.service");

exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, includeServices } = req.query;

    const { orders, total, totalPages } = await orderService.getAllOrders(
      parseInt(page),
      parseInt(limit),
      status,
      includeServices === "true"
    );

    res.set("X-Total-Count", total);
    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error in getAllOrders controller:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to fetch all orders.",
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error(
      `Error in getOrderById controller for ID ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ error: "Internal server error while fetching order details." });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const employee_id = req.employee?.employee_id || req.body.employee_id;
    if (!employee_id) {
      return res.status(400).json({ error: "Employee ID is required." });
    }

    const orderData = {
      ...req.body,
      employee_id,
    };

    const orderId = await orderService.createOrder(orderData);
    res.status(201).json({ orderId, message: "Order created successfully." });
  } catch (error) {
    console.error("Error in createOrder controller:", error);
    res.status(500).json({
      error: error.message,
      details: "Failed to create order",
      message: "Internal server error while creating order.",
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    // Pass the entire request body to the service layer for processing
    const updated = await orderService.updateOrder(req.params.id, req.body);
    if (!updated) {
      return res
        .status(404)
        .json({ error: "Order not found or no changes made." });
    }
    res.json({ success: true, message: "Order updated successfully." });
  } catch (error) {
    console.error(
      `Error in updateOrder controller for ID ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ error: "Internal server error while updating order." });
  }
};


