import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { useAuth } from "../../../../contexts/AuthContext";
import { format } from "date-fns";
import employeeService from "../../../../services/employee.service";

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const { employee } = useAuth();

  let token = employee?.employee_token || null;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await employeeService.getAllEmployees(token);
        if (!res.ok) {
          setApiError(true);
          switch (res.status) {
            case 401:
              setApiErrorMessage("Please login again");
              break;
            case 403:
              setApiErrorMessage("You are not authorized to view this page");
              break;
            default:
              setApiErrorMessage("Please try again later");
          }
          return;
        }

        const data = await res.json();
        if (data.data?.length > 0) {
          setEmployees(data.data);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setApiError(true);
        setApiErrorMessage("Network or server error.");
      }
    };

    fetchEmployees();
  }, []);

  return (
    <>
      {apiError ? (
        <section className="contact-section">
          <div className="auto-container">
            <div className="contact-title">
              <h2>{apiErrorMessage}</h2>
            </div>
          </div>
        </section>
      ) : (
        <section className="contact-section">
          <div className="auto-container">
            <div className="contact-title">
              <h2>Employees</h2>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Active</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Added Date</th>
                  <th>Role</th>
                  <th>Edit/Delete</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
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
                      <div className="edit-delete-icons">edit | delete</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>
      )}
    </>
  );
};

export default EmployeesList;
