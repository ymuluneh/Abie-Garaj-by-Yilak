import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import employeeService from "../../../../services/employee.service";
import { useAuth } from "../../../../contexts/AuthContext";

import styles from "./AddEmployeeForm.module.css"; // Import the CSS module

function AddEmployeeForm() {
  const navigate = useNavigate(); // Initialize navigate
  const [employee_email, setEmail] = useState("");
  const [employee_first_name, setFirstName] = useState("");
  const [employee_last_name, setLastName] = useState("");
  const [employee_phone, setPhoneNumber] = useState("");
  const [employee_password, setPassword] = useState("");
  const [company_role_id, setCompany_role_id] = useState(2); // Default to Employee role

  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState(""); // Renamed for clarity
  const [lastNameError, setLastNameError] = useState(""); // Added for last name validation
  const [phoneError, setPhoneError] = useState(""); // Added for phone validation
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  // Create a variable to hold the user's token
  let loggedInEmployeeToken = "";
  // Destructure the auth hook and get the token
  const { employee } = useAuth();
  if (employee && employee.employee_token) {
    loggedInEmployeeToken = employee.employee_token;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setServerError(""); // Clear previous server errors
    setSuccess(false); // Clear previous success messages

    let valid = true;

    // Reset all field errors
    setEmailError("");
    setFirstNameError("");
    setLastNameError("");
    setPhoneNumber("");
    setPasswordError("");

    if (!employee_first_name.trim()) {
      setFirstNameError("First name is required.");
      valid = false;
    }

    if (!employee_last_name.trim()) {
      setLastNameError("Last name is required.");
      valid = false;
    }

    if (!employee_phone.trim()) {
      setPhoneError("Phone number is required.");
      valid = false;
    } else if (!/^\d{10}$/.test(employee_phone.trim())) {
      // Basic 10-digit phone validation
      setPhoneError("Invalid phone number format (e.g., 10 digits).");
      valid = false;
    }

    if (!employee_email.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else {
      const regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(employee_email.trim())) {
        setEmailError("Invalid email format.");
        valid = false;
      }
    }

    if (!employee_password || employee_password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      valid = false;
    }

    if (!valid) {
      setLoading(false); // Stop loading if validation fails
      return;
    }

    const formData = {
      email: employee_email.trim(),
      password: employee_password,
      first_name: employee_first_name.trim(),
      last_name: employee_last_name.trim(),
      phone: employee_phone.trim(),
      role_id: company_role_id,
    };

    try {
      const response = await employeeService.createEmployee(
        formData,
        loggedInEmployeeToken
      );
      const data = await response.json();

      if (!response.ok) {
        setServerError(data.message || "Failed to add employee.");
      } else {
        setSuccess(true);
        // Clear form fields on success
        setEmail("");
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setPassword("");
        setCompany_role_id(2); // Reset to default role

        // Navigate after a short delay
        setTimeout(() => {
          navigate("/admin/employees"); // Redirect to employees list
        }, 1500);
      }
    } catch (error) {
      setServerError(
        error.message || "Request failed. Please check network connection."
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Add a new employee</h2>
      </div>
      <div className={styles.formColumn}>
        <div className={styles.contactForm}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              {serverError && (
                <div className={styles.serverError} role="alert">
                  {serverError}
                </div>
              )}
              {success && (
                <div className={styles.validationSuccess} role="alert">
                  Employee added successfully!
                </div>
              )}
              <input
                type="email"
                value={employee_email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Employee email"
                disabled={loading} // Disable during loading
              />
              {emailError && (
                <div className={styles.validationError}>{emailError}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                value={employee_first_name}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Employee first name"
                disabled={loading}
              />
              {firstNameError && (
                <div className={styles.validationError}>{firstNameError}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                value={employee_last_name}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Employee last name"
                disabled={loading}
              />
              {lastNameError && (
                <div className={styles.validationError}>{lastNameError}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                value={employee_phone}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Employee phone (e.g., 555-555-5555)"
                disabled={loading}
              />
              {phoneError && (
                <div className={styles.validationError}>{phoneError}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <select
                value={company_role_id}
                onChange={(e) => setCompany_role_id(Number(e.target.value))}
                className={styles.selectBox} // Using a specific class for the select
                disabled={loading}
              >
                <option value={2}>Employee</option>
                <option value={3}>Manager</option>
                <option value={1}>Admin</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <input
                type="password"
                value={employee_password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Employee password"
                disabled={loading}
              />
              {passwordError && (
                <div className={styles.validationError}>{passwordError}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <button
                className={styles.submitButton}
                type="submit"
                disabled={loading} // Disable button when loading
              >
                <span>{loading ? "Adding Employee..." : "Add Employee"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEmployeeForm;
