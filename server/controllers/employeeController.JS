const employeeService = require("../services/employeeService");

const addEmployee = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, role_id } = req.body;

    // Check for required fields
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

    // Check if employee already exists
    const existingEmployee = await employeeService.checkEmployeeExistenceByEmail(email);
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee already exists." });
    }

    // Add new employee
    const newEmployee = await employeeService.addEmployee({
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

module.exports = { addEmployee };
