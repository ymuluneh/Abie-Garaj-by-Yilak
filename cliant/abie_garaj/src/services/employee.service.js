// src/services/employee.service.js
// Import from the env
const api_url = import.meta.env.VITE_API_URL;

// A function to send POST request to create a new employee
const createEmployee = async (formData, loggedInEmployeeToken) => {
  const response = await fetch(`${api_url}/api/employees/addEmployee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInEmployeeToken,
    },
    credentials: "include", // Only if your backend requires cookies (optional)
    body: JSON.stringify(formData),
  });
  return response;
};

// A function to send get request to get all employees
const getAllEmployees = async (token) => {
  const response = await fetch(`${api_url}/api/employees/employees`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  return response;
};

// A function to get an employee by ID
const getEmployeeById = async (id, token) => {
  const response = await fetch(`${api_url}/api/employees/employees/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  return response;
};

// A function to update an employee
const updateEmployee = async (id, employeeData, token) => {
  const response = await fetch(`${api_url}/api/employees/employees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(employeeData),
  });
  return response;
};

// A function to delete an employee
const deleteEmployee = async (id, token) => {
  const response = await fetch(`${api_url}/api/employees/employees/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  return response;
};

// Export the service - ALL FUNCTIONS MUST BE INCLUDED HERE
const employeeService = {
  createEmployee,
  getAllEmployees,
  getEmployeeById, 
  updateEmployee, 
  deleteEmployee, 
};

export default employeeService;
