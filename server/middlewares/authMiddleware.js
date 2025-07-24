// Import the dotenv package
require("dotenv").config();
// Import the jsonwebtoken package
const jwt = require("jsonwebtoken");
// A function to verify the token received from the frontend
// Import the employee service
const employeeService = require("../services/employeeService");

// A function to verify the token received from the frontend
const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      status: "fail",
      message: "No token provided!",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        status: "fail",
        message: "Unauthorized!",
      });
    }

    if (!decoded || !decoded.employee_email) {
      return res.status(403).send({
        status: "fail",
        message: "Invalid token payload!",
      });
    }

   
    req.employee_email = decoded.employee_email;
    next();
  });
};

// A function to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    
    const employee_email = req.employee_email;
    const employee = await employeeService.getEmployeeByEmail(employee_email);

    if (!employee || employee.length === 0) {
      return res.status(404).send({
        status: "fail",
        error: "Employee not found.",
      });
    }

    if (employee[0].company_role_id === 1) {
      // role_id 3 = Admin
      next();
    } else {
      return res.status(403).send({
        status: "fail",
        error: "Not an Admin!",
      });
    }
  } catch (err) {
    console.error("Admin check failed:", err);
    res.status(500).send({
      status: "error",
      message: "Server error during admin verification.",
    });
  }
};

const authMiddleware = {
  verifyToken,
  isAdmin,
};

module.exports = authMiddleware;
