import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import { format } from "date-fns";
import employeeService from "../../../../services/employee.service";
import { useAuth } from "../../../../contexts/AuthContext"; 

// Import icons
import { FaEdit, FaTrashAlt } from "react-icons/fa"; 
import styles from "./EmployeesList.module.css"; // Import the CSS module

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const { employee } = useAuth();
  const navigate = useNavigate(); // Initialize navigate

  let token = employee?.employee_token || null;

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true); // Set loading to true when fetching starts
      setApiError(false); // Clear previous errors
      setApiErrorMessage(null);
      try {
        const res = await employeeService.getAllEmployees(token);
        if (!res.ok) {
          setApiError(true);
          switch (res.status) {
            case 401:
              setApiErrorMessage(
                "Authentication required. Please login again."
              );
              break;
            case 403:
              setApiErrorMessage("You are not authorized to view this page.");
              break;
            case 404:
              setApiErrorMessage("No employees found.");
              setEmployees([]); // Ensure employees array is empty
              break;
            default:
              setApiErrorMessage(
                "Failed to fetch employees. Please try again later."
              );
          }
          return;
        }

        const data = await res.json();
        // Check if data.data exists and is an array
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          setEmployees(data.data);
        } else {
          setEmployees([]); // No employees or empty array
          setApiErrorMessage("No employees found."); // Display a message for empty list
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setApiError(true);
        setApiErrorMessage(
          "Network or server error. Could not retrieve employees."
        );
      } finally {
        setLoading(false); // Set loading to false when fetching ends
      }
    };

    fetchEmployees();
  }, [token]); // Depend on token, so it refetches if token changes

  const handleDelete = async (employeeId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this employee? This action cannot be undone."
      )
    ) {
      try {
        setLoading(true); // Show loading feedback
        const response = await employeeService.deleteEmployee(
          employeeId,
          token
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete employee.");
        }
        // If deletion is successful, refetch the list to update the UI
        alert("Employee deleted successfully!");
        // Re-fetch employees to update the list
        const res = await employeeService.getAllEmployees(token);
        const data = await res.json();
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          setEmployees(data.data);
        } else {
          setEmployees([]);
          setApiErrorMessage("No employees found.");
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert(`Error: ${error.message}`);
        setApiError(true);
        setApiErrorMessage(error.message || "Failed to delete employee.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Employees</h2>
      </div>

      {loading && <div className={styles.loading}>Loading employees...</div>}

      {apiError && <div className={styles.apiError}>{apiErrorMessage}</div>}

      {!loading && !apiError && employees.length === 0 && (
        <div className={styles.noEmployees}>No employees found.</div>
      )}

      {!loading && !apiError && employees.length > 0 && (
        
        <table className={styles.employeeTable}> 
          <thead>
            <tr>
              <th className={styles.activeCol}>Active</th>
              <th className={styles.nameCol}>First Name</th>
              <th className={styles.nameCol}>Last Name</th>
              <th className={styles.emailCol}>Email</th>
              <th className={styles.phoneCol}>Phone</th>
              <th className={styles.dateCol}>Added Date</th>
              <th className={styles.roleCol}>Role</th>
              <th className={styles.actionsCol}>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employee_id}>
                <td>{employee.employee_active_status === 1 ? "Yes" : "No"}</td>
                <td>{employee.employee_first_name}</td>
                <td>{employee.employee_last_name}</td>
                <td>{employee.employee_email}</td>
                <td>{employee.employee_phone}</td>
                <td>
                  {employee.employee_added_date
                    ? format(
                        new Date(employee.employee_added_date),
                        "MM - dd - yyyy | HH:mm"
                      )
                    : "N/A"}
                </td>
                <td>{employee.company_role_name}</td>
                <td>
                  <div className={styles.actions}>
                    <Link
                      to={`/admin/employees/edit/${employee.employee_id}`}
                      title="Edit Employee"
                    >
                      <FaEdit
                        className={`${styles.actionIcon} ${styles.editIcon}`}
                      />
                    </Link>
                    <FaTrashAlt
                      className={`${styles.actionIcon} ${styles.deleteIcon}`}
                      onClick={() => handleDelete(employee.employee_id)}
                      title="Delete Employee"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table> 
      )}
    </div>
  );
};

export default EmployeesList;