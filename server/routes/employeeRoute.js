
const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller"); 
const authMiddleware = require("../middlewares/authMiddleware"); 
// Get all employees (admin only)
router.get(
  "/",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.getAllEmployees
); // 

// Get employee by ID (admin/self)
router.get(
  "/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.getEmployeeById
); 

// Add a new employee (admin only)
router.post(
  "/addEmployee",
  // [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.addEmployee
);

// Update an employee (admin only)
router.put(
  "/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.updateEmployee
);

// Delete an employee (admin only)
router.delete(
  "/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.deleteEmployee
);

module.exports = router;
