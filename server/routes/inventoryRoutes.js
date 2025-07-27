// inventoryRoutes.js
const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

router.get("/", inventoryController.getAllInventoryItems);
router.get("/:itemId/history", inventoryController.getItemTransactionHistory);
router.post("/", inventoryController.addInventoryItem);
router.post("/transaction", inventoryController.updateStockTransaction);

module.exports = router;
