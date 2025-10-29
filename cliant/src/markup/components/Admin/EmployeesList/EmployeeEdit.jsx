import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import employeeService from "../../../../services/employee.service";
import { useAuth } from "../../../../contexts/AuthContext";

import styles from "./EmployeeEdit.module.css"; // Import the CSS module

const EmployeeEdit = () => {
  const { id } = useParams(); // Get employee ID from URL
  const navigate = useNavigate();
  const { employee: loggedInEmployee } = useAuth(); // Renamed to avoid conflict

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role_id: 2, // Default to 'Employee' role_id
    is_active: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [roles, setRoles] = useState([]); // State to hold company roles

  useEffect(() => {
    const fetchEmployeeAndRoles = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch employee data
        const employeeRes = await employeeService.getEmployeeById(
          id,
          loggedInEmployee?.employee_token
        );
        if (!employeeRes.ok) {
          throw new Error(
            `Failed to fetch employee: ${employeeRes.statusText}`
          );
        }
        const employeeData = await employeeRes.json();
        // Assuming employeeData.data is the direct employee object
        if (!employeeData.data) {
          setError("Employee not found.");
          setLoading(false);
          return;
        }

        const employee = employeeData.data;
        setFormData({
          first_name: employee.employee_first_name || "",
          last_name: employee.employee_last_name || "",
          email: employee.employee_email || "",
          phone: employee.employee_phone || "",
          role_id: employee.company_role_id || 2, // Use existing role or default
          is_active: employee.employee_active_status === 1,
        });

        // Fetch company roles (you'll need to implement getCompanyRoles in employeeService)
        // For now, hardcode if your roles are static or fetched elsewhere
        // You might need a dedicated API endpoint for company_roles
        const availableRoles = [
          { company_role_id: 1, company_role_name: "Admin" },
          { company_role_id: 2, company_role_name: "Employee" },
          { company_role_id: 3, company_role_name: "Manager" },
        ];
        setRoles(availableRoles);
      } catch (err) {
        console.error("Error fetching employee or roles:", err);
        setError("Failed to load employee data. " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && loggedInEmployee?.employee_token) {
      fetchEmployeeAndRoles();
    } else {
      setError("No employee ID provided or not authenticated.");
      setLoading(false);
    }
  }, [id, loggedInEmployee?.employee_token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Basic validation
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await employeeService.updateEmployee(
        id, // Pass ID for the API call
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          role_id: formData.role_id,
          is_active: formData.is_active ? 1 : 0, // Convert boolean back to 0 or 1
        },
        loggedInEmployee?.employee_token
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update employee.");
      }

      setSuccessMessage("Employee updated successfully!");
      // Optionally navigate back to employee list after a short delay
      setTimeout(() => navigate("/admin/employees"), 1500);
    } catch (err) {
      console.error("Error updating employee:", err);
      setError(err.message || "Failed to update employee.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className={styles.loading}>Loading employee data...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!formData.email)
    return <div className={styles.notFound}>Employee not found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>
          Edit: {formData.first_name} {formData.last_name}
        </h2>
      </div>
      <p className={styles.employeeEmailDisplay}>
        Employee email: {formData.email}
      </p>

      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="role_id">Role</label>
          <select
            id="role_id"
            name="role_id"
            value={formData.role_id}
            onChange={handleChange}
          >
            {roles.map((role) => (
              <option key={role.company_role_id} value={role.company_role_id}>
                {role.company_role_name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
          <label htmlFor="is_active">Is active employee</label>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.updateButton}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate("/admin/employees")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeEdit;
