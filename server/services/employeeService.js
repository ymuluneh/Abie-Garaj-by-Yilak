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

// ✅ Get All Employees
const getAllEmployees = async () => {
  const conn = await pool.getConnection();
  try {
    const query = `
      SELECT * FROM employee 
      INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id 
      INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id 
      INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id 
      ORDER BY employee.employee_id DESC 
      LIMIT 10
    `;
    const [rows] = await conn.query(query);
    return rows;
  } finally {
    conn.release();
  }
};

module.exports = {
  addEmployee,
  checkEmployeeExistenceByEmail,
  getEmployeeByEmail,
  getAllEmployees,
};
