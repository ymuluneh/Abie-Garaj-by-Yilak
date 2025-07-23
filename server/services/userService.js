const bcrypt = require("bcrypt");
const { pool } = require("../config/config");

// ✅ Login user using correct schema alignment
const loginUser = async (email, password) => {
  const conn = await pool.getConnection();
  try {
    // 1️⃣ Fetch employee ID by email
    const [employeeRows] = await conn.query(
      "SELECT employee_id, employee_email FROM employee WHERE employee_email = ?",
      [email]
    );
    if (employeeRows.length === 0) return false;

    const employeeId = employeeRows[0].employee_id;

    // 2️⃣ Fetch password hash
    const [passRows] = await conn.query(
      "SELECT employee_password_hashed FROM employee_pass WHERE employee_id = ?",
      [employeeId]
    );
    if (passRows.length === 0) return false;

    const isMatch = await bcrypt.compare(
      password,
      passRows[0].employee_password_hashed
    );
    if (!isMatch) return false;

    // 3️⃣ Fetch employee first name from `employee_info`
    const [infoRows] = await conn.query(
      "SELECT employee_first_name FROM employee_info WHERE employee_id = ?",
      [employeeId]
    );

    // 4️⃣ Fetch employee role from `employee_role`
    const [roleRows] = await conn.query(
      "SELECT company_role_id FROM employee_role WHERE employee_id = ?",
      [employeeId]
    );

    return {
      id: employeeId,
      email,
      role: roleRows[0]?.company_role_id || null,
      first_name: infoRows[0]?.employee_first_name || "Employee",
    };
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  } finally {
    conn.release();
  }
};

module.exports = { loginUser };
