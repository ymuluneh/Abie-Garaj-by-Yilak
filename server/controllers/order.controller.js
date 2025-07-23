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
    res.status(500).json({
      success: false,
      error: error.message,
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
    res.status(500).json({ error: error.message });
  }
};
exports.createOrder = async (req, res) => {
  try {
    // Get employee_id from authenticated user (via JWT)
    const employee_id = req.employee?.employee_id || req.body.employee_id || 1;

    const orderData = {
      ...req.body,
      employee_id, // Ensure employee_id is included
    };

    const orderId = await orderService.createOrder(orderData);
    res.status(201).json({ orderId });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      details: "Failed to create order",
    });
  }
};
exports.updateOrder = async (req, res) => {
  try {
    const updated = await orderService.updateOrder(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await orderService.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
