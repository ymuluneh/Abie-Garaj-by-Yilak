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

const updateEmployee = (employee, token) => {
  return fetch(`${api_url}/api/employees/employees/${employee.employee_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(employee),
  });
};

const deleteEmployee = (id, token) => {
  return fetch(`${api_url}/api/employees/employees/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
};
// Export the service
const employeeService = {
  createEmployee,
  getAllEmployees,
};

export default employeeService;
