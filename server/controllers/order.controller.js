// controllers/order.controller.js
const orderService = require("../services/order.service");

exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const { orders, total, totalPages } = await orderService.getAllOrders(
      parseInt(page),
      parseInt(limit),
      status
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
    console.error("Error in getAllOrders controller:", error); // Added logging
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to fetch all orders.", // More user-friendly message
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order); // Frontend expects the order object directly
  } catch (error) {
    console.error(
      `Error in getOrderById controller for ID ${req.params.id}:`,
      error
    ); // Added logging
    res
      .status(500)
      .json({ error: "Internal server error while fetching order details." }); // Generic message for 500
  }
};

exports.createOrder = async (req, res) => {
  try {
    // Get employee_id from authenticated user (via JWT)
    // If you have auth middleware, req.employee will be populated.
    // If not, it's safer to require employee_id in the body for non-admin creation
    const employee_id = req.employee?.employee_id || req.body.employee_id; // Adjusted to be safer if req.employee is undefined
    if (!employee_id) {
      return res.status(400).json({ error: "Employee ID is required." });
    }

    const orderData = {
      ...req.body,
      employee_id, // Ensure employee_id is included
    };

    const orderId = await orderService.createOrder(orderData);
    res.status(201).json({ orderId, message: "Order created successfully." }); // Added success message
  } catch (error) {
    console.error("Error in createOrder controller:", error); // Added logging
    res.status(500).json({
      error: error.message,
      details: "Failed to create order",
      message: "Internal server error while creating order.", // More user-friendly message
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const updated = await orderService.updateOrder(req.params.id, req.body);
    if (!updated) {
      return res
        .status(404)
        .json({ error: "Order not found or no changes made." }); // Clarified message
    }
    res.json({ success: true, message: "Order updated successfully." }); // Added success message
  } catch (error) {
    console.error(
      `Error in updateOrder controller for ID ${req.params.id}:`,
      error
    ); // Added logging
    res
      .status(500)
      .json({ error: "Internal server error while updating order." });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required for update." });
    }
    const updated = await orderService.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res
        .status(404)
        .json({ error: "Order not found or status already set." }); // Clarified message
    }
    res.json({ success: true, message: "Order status updated successfully." }); // Added success message
  } catch (error) {
    console.error(
      `Error in updateOrderStatus controller for ID ${req.params.id}:`,
      error
    ); // Added logging
    res
      .status(500)
      .json({ error: "Internal server error while updating order status." });
  }
};
