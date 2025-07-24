// backend/controllers/employeeController.js
const employeeService = require("../services/employeeService");

const addEmployee = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, role_id } = req.body;

    if (
      !email ||
      !password ||
      !first_name ||
      !last_name ||
      !phone ||
      !role_id
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingEmployee =
      await employeeService.checkEmployeeExistenceByEmail(email);
    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Employee with this email already exists." });
    }

    await employeeService.addEmployee({
      email,
      password,
      first_name,
      last_name,
      phone,
      role_id,
    });

    res.status(201).json({
      message: "Employee added successfully",
      status: "success",
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Server error while adding employee." });
  }
};

// ✅ Get All Employees Controller (already good)
const getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.status(200).json({
      status: "success",
      data: employees,
    });
  } catch (error) {
    console.error("Failed to get all employees:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve employees.",
    });
  }
};

// ✅ Get Employee by ID Controller
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }
    res.status(200).json({
      status: "success",
      data: employee,
    });
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    res.status(500).json({ message: "Server error while fetching employee." });
  }
};

// ✅ Update Employee Controller
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, role_id, is_active } =
      req.body;

    // Basic validation
    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      role_id === undefined ||
      is_active === undefined
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required for update." });
    }

    // Check if employee exists
    const existingEmployee = await employeeService.getEmployeeById(id);
    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Optional: Check if email is being changed to an existing email by another user
    if (existingEmployee.employee_email !== email) {
      const emailInUse = await employeeService.checkEmployeeExistenceByEmail(
        email
      );
      if (emailInUse && emailInUse.employee_id !== parseInt(id)) {
        return res
          .status(400)
          .json({ message: "Email already in use by another employee." });
      }
    }

    const updated = await employeeService.updateEmployee(id, {
      first_name,
      last_name,
      email,
      phone,
      role_id,
      is_active,
    });

    if (updated) {
      res
        .status(200)
        .json({ message: "Employee updated successfully.", status: "success" });
    } else {
      res
        .status(400)
        .json({ message: "Failed to update employee.", status: "error" });
    }
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Server error while updating employee." });
  }
};

// ✅ Delete Employee Controller
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: Check if employee exists before attempting to delete
    const employeeToDelete = await employeeService.getEmployeeById(id);
    if (!employeeToDelete) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const deleted = await employeeService.deleteEmployee(id);
    if (deleted) {
      res
        .status(200)
        .json({ message: "Employee deleted successfully.", status: "success" });
    } else {
      res
        .status(400)
        .json({
          message:
            "Failed to delete employee. Employee might not exist or another issue occurred.",
        });
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Server error while deleting employee." });
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  getEmployeeById, // Export new function
  updateEmployee, // Export new function
  deleteEmployee, // Export new function
};
