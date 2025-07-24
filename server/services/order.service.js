const { pool } = require("../config/config");

class OrderService {
  /**
   * Fetches all orders with pagination and optional status filtering.
   * @param {number} page - The current page number.
   * @param {number} limit - The number of orders per page.
   * @param {string} status - Optional filter for order status.
   * @returns {object} An object containing the orders, total count, and total pages.
   */
  async getAllOrders(page, limit, status) {
    let connection;
    try {
      connection = await pool.getConnection();

      let query = `
        SELECT
          o.order_id,
          o.customer_id,
          o.employee_id,
          o.vehicle_id,
          o.order_date,
          o.order_status,
          ci.customer_first_name,
          ci.customer_last_name,
          c.customer_email,
          c.customer_phone_number,
          v.vehicle_year,
          v.vehicle_make,
          v.vehicle_model,
          v.vehicle_tag,
          v.vehicle_mileage,
          oi.order_total_price,
          oi.order_estimated_completion_date,
          oi.order_completion_date,
          oi.order_additional_requests,
          ei.employee_first_name,
          ei.employee_last_name
        FROM orders o
        JOIN customer_identifier c ON o.customer_id = c.customer_id
        JOIN customer_info ci ON c.customer_id = ci.customer_id
        LEFT JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
        LEFT JOIN order_info oi ON o.order_id = oi.order_id
        LEFT JOIN employee_info ei ON o.employee_id = ei.employee_id
      `;

      let countQuery = `
        SELECT COUNT(o.order_id) AS total
        FROM orders o
        JOIN customer_identifier c ON o.customer_id = c.customer_id
        JOIN customer_info ci ON c.customer_id = ci.customer_id
        LEFT JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
        LEFT JOIN order_info oi ON o.order_id = oi.order_id
        LEFT JOIN employee_info ei ON o.employee_id = ei.employee_id
      `;

      const params = [];
      const countParams = [];

      if (status) {
        query += ` WHERE o.order_status = ?`;
        countQuery += ` WHERE o.order_status = ?`;
        params.push(status);
        countParams.push(status);
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY o.order_date DESC LIMIT ? OFFSET ?`; // Order by date to ensure consistent pagination
      params.push(limit, offset);

      const [orderRows] = await connection.query(query, params);
      const [countRows] = await connection.query(countQuery, countParams);

      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limit);

      const orders = orderRows.map((order) => {
        // Format dates if they exist
        if (order.order_date) {
          order.order_date = new Date(order.order_date).toLocaleDateString(
            "en-US"
          ); // Or toISOString() if frontend prefers ISO
        }
        if (order.order_estimated_completion_date) {
          order.order_estimated_completion_date = new Date(
            order.order_estimated_completion_date
          ).toLocaleDateString("en-US");
        }
        if (order.order_completion_date) {
          order.order_completion_date = new Date(
            order.order_completion_date
          ).toLocaleDateString("en-US");
        }
        return order;
      });

      return { orders, total, totalPages };
    } catch (error) {
      console.error("Error in OrderService.getAllOrders:", error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Fetches a single order by its ID, including related customer, vehicle, and service information.
   * @param {number} orderId - The ID of the order to fetch.
   * @returns {object|null} The order object if found, otherwise null.
   */
  async getOrderById(orderId) {
    let connection;
    try {
      connection = await pool.getConnection();

      const [orderRows] = await connection.query(
        `
        SELECT
          o.order_id,
          o.customer_id,
          o.employee_id,
          o.vehicle_id,
          o.order_date,
          o.order_status,
          ci.customer_first_name,
          ci.customer_last_name,
          c.customer_email,
          c.customer_phone_number,
          v.vehicle_year,
          v.vehicle_make,
          v.vehicle_model,
          v.vehicle_tag,
          v.vehicle_mileage,
          oi.order_total_price,
          oi.order_estimated_completion_date,
          oi.order_completion_date,
          oi.order_additional_requests,
          ei.employee_first_name,
          ei.employee_last_name
        FROM orders o
        JOIN customer_identifier c ON o.customer_id = c.customer_id
        JOIN customer_info ci ON c.customer_id = ci.customer_id
        LEFT JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
        LEFT JOIN order_info oi ON o.order_id = oi.order_id
        LEFT JOIN employee_info ei ON o.employee_id = ei.employee_id
        WHERE o.order_id = ?
      `,
        [orderId]
      );

      if (orderRows.length === 0) return null;
      const order = orderRows[0];

      // Get services for the order
      const [serviceRows] = await connection.query(
        `
        SELECT
          os.order_service_id,
          os.service_id,
          cs.service_name,
          cs.service_description,
          os.service_completed
        FROM order_services os
        JOIN common_services cs ON os.service_id = cs.service_id
        WHERE os.order_id = ?
      `,
        [orderId]
      );

      order.services = serviceRows.map((service) => ({
        ...service,
        service_completed: Boolean(service.service_completed),
      }));

      // Ensure that date fields are correctly formatted
      if (order.order_date)
        order.order_date = new Date(order.order_date).toLocaleDateString(
          "en-US"
        );
      if (order.order_estimated_completion_date)
        order.order_estimated_completion_date = new Date(
          order.order_estimated_completion_date
        ).toLocaleDateString("en-US");
      if (order.order_completion_date)
        order.order_completion_date = new Date(
          order.order_completion_date
        ).toLocaleDateString("en-US");

      return order;
    } catch (error) {
      console.error(
        `Error in OrderService.getOrderById for orderId ${orderId}:`,
        error
      );
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Creates a new order along with its associated order info and services.
   * @param {object} orderData - The data for the new order.
   * @returns {number} The ID of the newly created order.
   */
  async createOrder(orderData) {
    const {
      customer_id,
      employee_id,
      vehicle_id,
      services,
      additional_requests,
    } = orderData;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Insert into orders table
      const [orderResult] = await connection.query(
        `INSERT INTO orders (customer_id, employee_id, vehicle_id) VALUES (?, ?, ?)`,
        [customer_id, employee_id, vehicle_id]
      );
      const orderId = orderResult.insertId;

      // 2. Insert into order_info
      await connection.query(
        `INSERT INTO order_info (order_id, order_additional_requests) VALUES (?, ?)`,
        [orderId, additional_requests || ""]
      );

      // 3. Insert services
      if (services && Array.isArray(services) && services.length > 0) {
        const serviceValues = services.map((service) => [
          orderId,
          service.service_id,
        ]);
        await connection.query(
          `INSERT INTO order_services (order_id, service_id) VALUES ?`,
          [serviceValues]
        );
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      console.error("Error creating order in service:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Updates an existing order's status, additional requests, and associated services.
   * @param {number} orderId - The ID of the order to update.
   * @param {object} orderData - The data to update. Can include `status`, `additional_requests`, `services`.
   * @returns {boolean} True if the order was updated, false otherwise.
   */
  async updateOrder(orderId, orderData) {
    const { services, additional_requests, status } = orderData;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      let updatedCount = 0;

      // Update order status if provided
      if (status) {
        const [result] = await connection.query(
          `UPDATE orders SET order_status = ? WHERE order_id = ?`,
          [status, orderId]
        );
        updatedCount += result.affectedRows;
      }

      // Update additional requests in order_info
      // Check if order_info exists, if not, insert it (UPSERT logic)
      const [orderInfoExists] = await connection.query(
        `SELECT 1 FROM order_info WHERE order_id = ?`,
        [orderId]
      );

      if (additional_requests !== undefined) {
        // Only update if additional_requests is explicitly provided
        if (orderInfoExists.length > 0) {
          const [result] = await connection.query(
            `UPDATE order_info SET order_additional_requests = ? WHERE order_id = ?`,
            [additional_requests, orderId]
          );
          updatedCount += result.affectedRows;
        } else {
          const [result] = await connection.query(
            `INSERT INTO order_info (order_id, order_additional_requests) VALUES (?, ?)`,
            [orderId, additional_requests]
          );
          updatedCount += result.affectedRows;
        }
      }

      // Update services - delete existing and add new
      if (services && Array.isArray(services)) {
        await connection.query(
          `DELETE FROM order_services WHERE order_id = ?`,
          [orderId]
        );
        updatedCount++; // Count this as an update operation

        if (services.length > 0) {
          const serviceValues = services.map((service) => [
            orderId,
            service.service_id,
            service.service_completed ? 1 : 0,
          ]);
          const [result] = await connection.query(
            `INSERT INTO order_services (order_id, service_id, service_completed) VALUES ?`,
            [serviceValues]
          );
          updatedCount += result.affectedRows;
        }
      }

      await connection.commit();
      return updatedCount > 0; // Return true if any rows were affected
    } catch (error) {
      await connection.rollback();
      console.error(
        `Error in OrderService.updateOrder for orderId ${orderId}:`,
        error
      );
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Updates only the status of an existing order.
   * @param {number} orderId - The ID of the order to update.
   * @param {string} status - The new status of the order.
   * @returns {boolean} True if the status was updated, false otherwise.
   */
  async updateOrderStatus(orderId, status) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query(
        `UPDATE orders SET order_status = ? WHERE order_id = ?`,
        [status, orderId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        `Error in OrderService.updateOrderStatus for orderId ${orderId}:`,
        error
      );
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = new OrderService();
