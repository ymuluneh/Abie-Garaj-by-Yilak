// Import from the env
const api_url = import.meta.env.VITE_API_URL;

// A function to send POST request to create a new employee
const createEmployee = async (formData) => {
  const response = await fetch(`${api_url}/api/employees/addEmployee`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Only if your backend requires cookies (optional)
    body: JSON.stringify(formData),
  });
  return response;
};

// Export the service
const employeeService = {
  createEmployee,
};

export default employeeService;
