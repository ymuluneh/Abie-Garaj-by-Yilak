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

    // 1. Check if role_id exists in company_roles
    const [roleCheck] = await conn.query(
      "SELECT company_role_id FROM company_roles WHERE company_role_id = ?",
      [role_id]
    );

    if (roleCheck.length === 0) {
      throw new Error(
        `Role ID ${role_id} does not exist in company_roles table`
      );
    }

    // 2. Insert into employee
    const [employeeRes] = await conn.query(
      "INSERT INTO employee (employee_email, employee_active_status) VALUES (?, ?)",
      [email, 1]
    );
    const employeeId = employeeRes.insertId;

    // 3. Hash and insert password
    const salt = await bcrypt.genSalt(10);// Generate salt
    const hashedPassword = await bcrypt.hash(password, 10);
    await conn.query(
      "INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)",
      [employeeId, hashedPassword]
    );

    // 4. Insert into employee_info
    await conn.query(
      "INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)",
      [employeeId, first_name, last_name, phone]
    );

    // 5. Insert into employee_role
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

// ✅ Check Employee by Email
const checkEmployeeExistenceByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM employee WHERE employee_email = ?",
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
};

module.exports = {
  addEmployee,
  checkEmployeeExistenceByEmail,
};
