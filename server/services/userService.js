const bcrypt = require("bcrypt");
const { pool } = require("../config/config"); // ✅ destructure pool from config
// const bcrypt = require("bcrypt");


const registerUser = async (email, password) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

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

    await conn.commit();
    return { success: true, employeeId };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const loginUser = async (email, password) => {
  const conn = await pool.getConnection();
  try {
    const [employeeRows] = await conn.query(
      "SELECT employee_id FROM employee WHERE employee_email = ?",
      [email]
    );
    if (employeeRows.length === 0) return false;

    const employeeId = employeeRows[0].employee_id;

    const [passRows] = await conn.query(
      "SELECT employee_password_hashed FROM employee_pass WHERE employee_id = ?",
      [employeeId]
    );
    if (passRows.length === 0) return false;

    const isMatch = await bcrypt.compare(
      password,
      passRows[0].employee_password_hashed
    );
    return isMatch;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  } finally {
    conn.release();
  }
};

module.exports = { registerUser, loginUser };
