const { pool } = require("../config/config");

exports.createCustomer = async (customerData) => {
  // Extract fields with either naming convention
  const email = customerData.email || customerData.customer_email;
  const phone = customerData.phone || customerData.customer_phone_number;
  const firstName = customerData.firstName || customerData.customer_first_name;
  const lastName = customerData.lastName || customerData.customer_last_name;

  // Set defaults for optional fields
  const hash = customerData.hash || "";
  const activeStatus =
    customerData.activeStatus !== undefined ? customerData.activeStatus : 1;
  const addedDate = customerData.addedDate || new Date();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [identifierResult] = await connection.query(
      `INSERT INTO customer_identifier
       (customer_email, customer_phone_number, customer_hash, customer_added_date)
       VALUES (?, ?, ?, ?)`,
      [email, phone, hash, addedDate]
    );

    const customerId = identifierResult.insertId;

    await connection.query(
      `INSERT INTO customer_info
       (customer_id, customer_first_name, customer_last_name, customer_active_status)
       VALUES (?, ?, ?, ?)`,
      [customerId, firstName, lastName, activeStatus]
    );

    await connection.commit();
    return customerId;
  } catch (error) {
    await connection.rollback();
    throw new Error(`Error creating customer: ${error.message}`);
  } finally {
    connection.release();
  }
};

exports.getCustomers = async (page, limit, sortby, search) => {
  const offset = (page - 1) * limit;
  try {
    let query = `
             SELECT
               ci.customer_id,
               ci.customer_email,
               ci.customer_phone_number,
               cinfo.customer_first_name,
               cinfo.customer_last_name,
               ci.customer_added_date,
               cinfo.customer_active_status
             FROM customer_identifier ci
             JOIN customer_info cinfo ON ci.customer_id = cinfo.customer_id
         `;

    let countQuery =
      "SELECT COUNT(*) AS total FROM customer_identifier ci JOIN customer_info cinfo ON ci.customer_id = cinfo.customer_id";
    let params = [];
    let countParams = [];

    if (search) {
      query += ` WHERE cinfo.customer_first_name LIKE ? OR cinfo.customer_last_name LIKE ? OR ci.customer_email LIKE ? OR ci.customer_phone_number LIKE ?`;
      countQuery += ` WHERE cinfo.customer_first_name LIKE ? OR cinfo.customer_last_name LIKE ? OR ci.customer_email LIKE ? OR ci.customer_phone_number LIKE ?`;
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm, searchTerm];
      countParams = [searchTerm, searchTerm, searchTerm, searchTerm];
    }

    const validSortColumns = [
      "customer_id",
      "customer_first_name",
      "customer_last_name",
      "customer_email",
      "customer_added_date",
    ];
    if (validSortColumns.includes(sortby)) {
      query += ` ORDER BY ${sortby}`;
    } else {
      query += " ORDER BY customer_added_date DESC";
    }

    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    const [count] = await pool.query(countQuery, countParams);

   

    return {
      total: count[0].total,
      customers: rows,
    };
  } catch (error) {
    throw new Error(`Error fetching customers: ${error.message}`);
  }
};

exports.getCustomerById = async (id) => {
  try {
    const [rows] = await pool.query(
      `
             SELECT
               ci.customer_id,
               ci.customer_email,
               ci.customer_phone_number,
               ci.customer_hash,
               ci.customer_added_date,
               cinfo.customer_first_name,
               cinfo.customer_last_name,
               cinfo.customer_active_status
             FROM customer_identifier ci
             JOIN customer_info cinfo ON ci.customer_id = cinfo.customer_id
             WHERE ci.customer_id = ?
         `,
      [id]
    );

    if (rows.length === 0) {
      throw new Error("Customer not found");
    }

    return rows[0];
  } catch (error) {
    throw new Error(`Error fetching customer: ${error.message}`);
  }
};

exports.updateCustomer = async (id, data) => {
  const { phone, firstName, lastName, activeStatus } = data;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Update phone in customer_identifier if provided
    if (phone !== undefined) {
      await connection.query(
        `UPDATE customer_identifier 
         SET customer_phone_number = ? 
         WHERE customer_id = ?`,
        [phone, id]
      );
    }

    // Update other fields in customer_info
    await connection.query(
      `UPDATE customer_info 
       SET customer_first_name = ?,
           customer_last_name = ?,
           customer_active_status = ?
       WHERE customer_id = ?`,
      [firstName, lastName, activeStatus, id]
    );

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};