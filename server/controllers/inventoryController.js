const inventoryService = require("../services/inventoryService");

exports.getAllInventoryItems = async (req, res) => {
  try {
    const items = await inventoryService.getAllInventoryItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getItemTransactionHistory = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const history = await inventoryService.getItemTransactionHistory(itemId);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.addInventoryItem = async (req, res) => {
  try {
    const result = await inventoryService.addInventoryItem(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStockTransaction = async (req, res) => {
  try {
    const result = await inventoryService.updateStockTransaction(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
