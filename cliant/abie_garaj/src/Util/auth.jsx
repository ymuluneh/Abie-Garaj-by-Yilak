// ✅ Function to read the data from the user's local storage
const getAuth = async () => {
  const employee = JSON.parse(localStorage.getItem("employee"));

  // ✅ Decode JWT if exists
  if (employee && employee.employee_token) {
    const decodedToken = decodeTokenPayload(employee.employee_token);
    employee.employee_role = decodedToken.employee_role;
    employee.employee_id = decodedToken.employee_id;
    employee.employee_first_name = decodedToken.employee_first_name;
    return employee;
  } else {
    return {};
  }
};

// ✅ Function to decode the payload from the token
// Converts base64 encoded JWT payload into readable JSON
const decodeTokenPayload = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );
  return JSON.parse(jsonPayload);
};

export default getAuth;
