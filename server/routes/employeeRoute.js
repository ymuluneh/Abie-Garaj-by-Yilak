// backend/routes/employeeRoutes.js (assuming this is your file and its path is correct)
const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller"); 
const authMiddleware = require("../middlewares/authMiddleware"); 
// Get all employees (admin only)
router.get(
  "/employees",
  [authMiddleware.verifyToken,
  authMiddleware.isAdmin],
  employeeController.getAllEmployees
); // <-- Check this line, particularly employeeController.getAllEmployees

// Get employee by ID (admin/self)
router.get(
  "/employees/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.getEmployeeById
); // <-- Check this line, particularly employeeController.getEmployeeById

// Add a new employee (admin only)
router.post(
  "/addEmployee",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.addEmployee
);

// Update an employee (admin only)
router.put(
  "/employees/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.updateEmployee
);

// Delete an employee (admin only)
router.delete(
  "/employees/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.deleteEmployee
);

module.exports = router;
