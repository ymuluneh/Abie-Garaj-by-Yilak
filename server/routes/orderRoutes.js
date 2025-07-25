const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.post("/", orderController.createOrder);
router.put("/:id", orderController.updateOrder);
// router.put("/:id/status", orderController.updateOrderStatus);

// router.post("/:id/notify-completion", orderController.notifyOrderCompletion);

module.exports = router;
