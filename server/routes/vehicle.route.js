// routes/vehicle.routes.js
const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicle.controller");

router.post("/", vehicleController.addVehicle);
router.put("/", vehicleController.updateVehicle);
router.get("/:id", vehicleController.getVehicleById);
router.get("/customer/:customer_id", vehicleController.getVehiclesByCustomerId);

module.exports = router;
