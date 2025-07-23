const express = require("express");
const {
  addEmployee,
  getAllEmployees,
} = require("../controllers/employee.controller");

const authMiddleware = require("../middlewares/authMiddleware");

const employeeRouter = express.Router();

// Protected routes
employeeRouter.post(
  "/addEmployee",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  addEmployee
);

employeeRouter.get(
  "/employees",
 
  getAllEmployees
);

module.exports = employeeRouter;
