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
      return res.status(400).json({ message: "Employee already exists." });
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
    res.status(500).json({ message: "Server error while adding employee" });
  }
};

// ✅ Get All Employees Controller
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
      message: "Failed to retrieve employees",
    });
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
};
