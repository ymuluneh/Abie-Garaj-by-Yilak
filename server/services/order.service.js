const { pool } = require("../config/config");
class OrderService {
  async getAllOrders(page = 1, limit = 10, status = null) {
    const offset = (page - 1) * limit;
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
        v.vehicle_year,
        v.vehicle_make,
        v.vehicle_model,
        v.vehicle_tag
      FROM orders o
      JOIN customer_identifier c ON o.customer_id = c.customer_id
      JOIN customer_info ci ON c.customer_id = ci.customer_id
      LEFT JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
    `;

    const params = [];
    if (status) {
      query += " WHERE o.order_status = ?";
      params.push(status);
    }

    query += " ORDER BY o.order_date DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [orders] = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = "SELECT COUNT(*) as total FROM orders";
    if (status) {
      countQuery += " WHERE order_status = ?";
    }
    const [countResult] = await pool.query(countQuery, status ? [status] : []);

    return {
      orders,
      total: countResult[0].total,
      totalPages: Math.ceil(countResult[0].total / limit),
    };
  }

  async getOrderById(orderId) {
    const [orderRows] = await pool.query(
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
        ci.customer_email,
        ci.customer_phone_number,
        v.vehicle_year,
        v.vehicle_make,
        v.vehicle_model,
        v.vehicle_tag,
        v.vehicle_mileage,
        oi.order_total_price,
        oi.order_estimated_completion_date,
        oi.order_completion_date,
        oi.order_additional_requests
      FROM orders o
      JOIN customer_identifier c ON o.customer_id = c.customer_id
      JOIN customer_info ci ON c.customer_id = ci.customer_id
      LEFT JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
      LEFT JOIN order_info oi ON o.order_id = oi.order_id
      WHERE o.order_id = ?
    `,
      [orderId]
    );

    if (orderRows.length === 0) return null;
    const order = orderRows[0];

    // Get services for the order
    const [serviceRows] = await pool.query(
      `
      SELECT 
        os.order_service_id,
        os.service_id,
        cs.service_name,
        os.service_completed
      FROM order_services os
      JOIN common_services cs ON os.service_id = cs.service_id
      WHERE os.order_id = ?
    `,
      [orderId]
    );

    order.services = serviceRows;
    return order;
  }

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

      // Insert into orders table
      const [orderResult] = await connection.query(
        `
        INSERT INTO orders (customer_id, employee_id, vehicle_id, order_date, order_status)
        VALUES (?, ?, ?, NOW(), 'pending')
      `,
        [customer_id, employee_id, vehicle_id]
      );

      const orderId = orderResult.insertId;

      // Insert into order_info table
      await connection.query(
        `
        INSERT INTO order_info (order_id, order_additional_requests)
        VALUES (?, ?)
      `,
        [orderId, additional_requests]
      );

      // Insert order services
      for (const service of services) {
        await connection.query(
          `
          INSERT INTO order_services (order_id, service_id)
          VALUES (?, ?)
        `,
          [orderId, service.service_id]
        );
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateOrder(orderId, orderData) {
    const { services, additional_requests, status } = orderData;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Update order status if provided
      if (status) {
        await connection.query(
          `
          UPDATE orders SET order_status = ? WHERE order_id = ?
        `,
          [status, orderId]
        );
      }

      // Update additional requests
      await connection.query(
        `
        UPDATE order_info 
        SET order_additional_requests = ?
        WHERE order_id = ?
      `,
        [additional_requests, orderId]
      );

      // Update services - delete existing and add new
      await connection.query(
        `
        DELETE FROM order_services WHERE order_id = ?
      `,
        [orderId]
      );

      for (const service of services) {
        await connection.query(
          `
          INSERT INTO order_services (order_id, service_id, service_completed)
          VALUES (?, ?, ?)
        `,
          [orderId, service.service_id, service.service_completed || 0]
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateOrderStatus(orderId, status) {
    const [result] = await pool.query(
      `
      UPDATE orders SET order_status = ? WHERE order_id = ?
    `,
      [status, orderId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new OrderService();
