// backend/services/employeeService.js
const bcrypt = require("bcrypt");
const { pool } = require("../config/config");

// ✅ Add Employee
const addEmployee = async ({
  email,
  password,
  first_name,
  last_name,
  phone,
  role_id,
}) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [roleCheck] = await conn.query(
      "SELECT company_role_id FROM company_roles WHERE company_role_id = ?",
      [role_id]
    );

    if (roleCheck.length === 0) {
      throw new Error(`Role ID ${role_id} does not exist`);
    }

    const [employeeRes] = await conn.query(
      "INSERT INTO employee (employee_email, employee_active_status) VALUES (?, ?)",
      [email, 1]
    );
    const employeeId = employeeRes.insertId;

    const hashedPassword = await bcrypt.hash(password, 10);
    await conn.query(
      "INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)",
      [employeeId, hashedPassword]
    );

    await conn.query(
      "INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)",
      [employeeId, first_name, last_name, phone]
    );

    await conn.query(
      "INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)",
      [employeeId, role_id]
    );

    await conn.commit();

    return {
      employee_id: employeeId,
      email,
      first_name,
      last_name,
      phone,
      role_id,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

// ✅ Check if employee exists
const checkEmployeeExistenceByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM employee WHERE employee_email = ?",
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
};

// ✅ Get Employee by Email
const getEmployeeByEmail = async (email) => {
  // This is already present, but for consistency
  const conn = await pool.getConnection();
  try {
    const query = `
      SELECT *
      FROM employee
      INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id
      INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id
      INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id
      WHERE employee.employee_email = ?
    `;
    const [rows] = await conn.query(query, [email]);
    return rows;
  } finally {
    conn.release();
  }
};

// ✅ Get Employee by ID
const getEmployeeById = async (employeeId) => {
  const conn = await pool.getConnection();
  try {
    const query = `
      SELECT
        e.employee_id,
        e.employee_email,
        e.employee_active_status,
        ei.employee_first_name,
        ei.employee_last_name,
        ei.employee_phone,
        er.company_role_id,
        cr.company_role_name,
        e.employee_added_date
      FROM employee AS e
      INNER JOIN employee_info AS ei ON e.employee_id = ei.employee_id
      INNER JOIN employee_role AS er ON e.employee_id = er.employee_id
      INNER JOIN company_roles AS cr ON er.company_role_id = cr.company_role_id
      WHERE e.employee_id = ?
    `;
    const [rows] = await conn.query(query, [employeeId]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    conn.release();
  }
};

// ✅ Get All Employees
const getAllEmployees = async () => {
  const conn = await pool.getConnection();
  try {
    const query = `
      SELECT
        e.employee_id,
        e.employee_email,
        e.employee_active_status,
        e.employee_added_date,
        ei.employee_first_name,
        ei.employee_last_name,
        ei.employee_phone,
        er.company_role_id,
        cr.company_role_name
      FROM employee AS e
      INNER JOIN employee_info AS ei ON e.employee_id = ei.employee_id
      INNER JOIN employee_role AS er ON e.employee_id = er.employee_id
      INNER JOIN company_roles AS cr ON er.company_role_id = cr.company_role_id
      ORDER BY e.employee_id DESC
    `; // Removed LIMIT 10, to get all employees for the list
    const [rows] = await conn.query(query);
    return rows;
  } finally {
    conn.release();
  }
};

// ✅ Update Employee
const updateEmployee = async (
  employeeId,
  { first_name, last_name, email, phone, role_id, is_active }
) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Update employee table (for email and active status)
    await conn.query(
      "UPDATE employee SET employee_email = ?, employee_active_status = ? WHERE employee_id = ?",
      [email, is_active, employeeId]
    );

    // Update employee_info table
    await conn.query(
      "UPDATE employee_info SET employee_first_name = ?, employee_last_name = ?, employee_phone = ? WHERE employee_id = ?",
      [first_name, last_name, phone, employeeId]
    );

    // Update employee_role table
    await conn.query(
      "UPDATE employee_role SET company_role_id = ? WHERE employee_id = ?",
      [role_id, employeeId]
    );

    await conn.commit();
    return true; // Indicate success
  } catch (err) {
    await conn.rollback();
    console.error("Error updating employee in service:", err);
    throw err;
  } finally {
    conn.release();
  }
};

// ✅ Delete Employee
const deleteEmployee = async (employeeId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Delete from dependent tables first
    await conn.query("DELETE FROM employee_pass WHERE employee_id = ?", [
      employeeId,
    ]);
    await conn.query("DELETE FROM employee_info WHERE employee_id = ?", [
      employeeId,
    ]);
    await conn.query("DELETE FROM employee_role WHERE employee_id = ?", [
      employeeId,
    ]);

    // Finally, delete from the main employee table
    const [result] = await conn.query(
      "DELETE FROM employee WHERE employee_id = ?",
      [employeeId]
    );

    await conn.commit();
    return result.affectedRows > 0; // True if an employee was deleted
  } catch (err) {
    await conn.rollback();
    console.error("Error deleting employee in service:", err);
    throw err;
  } finally {
    conn.release();
  }
};

module.exports = {
  addEmployee,
  checkEmployeeExistenceByEmail,
  getEmployeeByEmail,
  getAllEmployees,
  getEmployeeById, // Export the new function
  updateEmployee, // Export the new function
  deleteEmployee, // Export the new function
};
