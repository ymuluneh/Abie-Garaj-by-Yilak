import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import employeeService from "../../../../services/employee.service";
import { useAuth } from "../../../../contexts/AuthContext";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import styles from "./EmployeesList.module.css";

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);
  const { employee } = useAuth();
  const navigate = useNavigate();

  let token = employee?.employee_token || null;

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setApiError(false);
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
              setEmployees([]);
              setFilteredEmployees([]);
              break;
            default:
              setApiErrorMessage(
                "Failed to fetch employees. Please try again later."
              );
          }
          return;
        }

        const data = await res.json();
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          setEmployees(data.data);
          setFilteredEmployees(data.data);
        } else {
          setEmployees([]);
          setFilteredEmployees([]);
          setApiErrorMessage("No employees found.");
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setApiError(true);
        setApiErrorMessage(
          "Network or server error. Could not retrieve employees."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [token]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredEmployees(employees);
      setCurrentPage(1);
      return;
    }

    const results = employees.filter((emp) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        emp.employee_first_name.toLowerCase().includes(searchLower) ||
        emp.employee_last_name.toLowerCase().includes(searchLower) ||
        emp.employee_email.toLowerCase().includes(searchLower) ||
        (emp.employee_phone && emp.employee_phone.includes(searchTerm)) ||
        (emp.company_role_name &&
          emp.company_role_name.toLowerCase().includes(searchLower))
      );
    });

    setFilteredEmployees(results);
    setCurrentPage(1);
  }, [searchTerm, employees]);

  const handleDelete = async (employeeId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this employee? This action cannot be undone."
      )
    ) {
      try {
        setLoading(true);
        const response = await employeeService.deleteEmployee(
          employeeId,
          token
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete employee.");
        }
        alert("Employee deleted successfully!");
        const res = await employeeService.getAllEmployees(token);
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          setEmployees(data.data);
          setFilteredEmployees(data.data);
        } else {
          setEmployees([]);
          setFilteredEmployees([]);
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

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Employees</h2>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {loading && <div className={styles.loading}>Loading employees...</div>}

      {apiError && <div className={styles.apiError}>{apiErrorMessage}</div>}

      {!loading && !apiError && filteredEmployees.length === 0 && (
        <div className={styles.noEmployees}>
          {searchTerm
            ? "No employees match your search criteria"
            : "No employees found"}
        </div>
      )}

      {!loading && !apiError && filteredEmployees.length > 0 && (
        <>
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
                <th className={styles.actionsCol}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee) => (
                <tr key={employee.employee_id}>
                  <td>
                    {employee.employee_active_status === 1 ? "Yes" : "No"}
                  </td>
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

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button onClick={() => paginate(1)} disabled={currentPage === 1}>
                First
              </button>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeesList;
