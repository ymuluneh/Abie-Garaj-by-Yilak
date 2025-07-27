// order.service.js
const { pool } = require("../config/config");
const emailService = require("../utils/emailService"); // Ensure this path is correct

class OrderService {
  /**
   * Fetches all orders with pagination, optional status filtering,
   * and their associated services if `includeServices` is true.
   */
  async getAllOrders(page, limit, status, includeServices = false) {
    let connection;
    try {
      connection = await pool.getConnection();

      let baseQuery = `
        SELECT
          o.order_id,
          o.customer_id,
          o.employee_id,
          o.vehicle_id,
          o.order_date,
          o.order_status, -- Include overall order_status
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
        baseQuery += ` WHERE o.order_status = ?`;
        countQuery += ` WHERE o.order_status = ?`;
        params.push(status);
        countParams.push(status);
      }

      const offset = (page - 1) * limit;
      baseQuery += ` ORDER BY o.order_date DESC LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [orderRows] = await connection.query(baseQuery, params);
      const [countRows] = await connection.query(countQuery, countParams);

      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limit);

      const orders = orderRows.map((order) => {
        // Date formatting should ideally be done on the frontend for display
        // but keeping it here for consistency with existing code.
        if (order.order_date) {
          order.order_date = new Date(order.order_date).toISOString(); // Send ISO string to frontend
        }
        if (order.order_estimated_completion_date) {
          order.order_estimated_completion_date = new Date(
            order.order_estimated_completion_date
          ).toISOString(); // Send ISO string
        }
        if (order.order_completion_date) {
          order.order_completion_date = new Date(
            order.order_completion_date
          ).toISOString(); // Send ISO string
        }
        return order;
      });

      if (includeServices && orders.length > 0) {
        const orderIds = orders.map((o) => o.order_id);
        const [orderServicesRows] = await connection.query(
          `
          SELECT
            os.order_id,
            os.service_id,
            cs.service_name,
            cs.service_description,
            cs.service_price,
            os.service_completed
          FROM order_services os
          JOIN common_services cs ON os.service_id = cs.service_id
          WHERE os.order_id IN (?)
          `,
          [orderIds]
        );

        const servicesMap = new Map();
        orderServicesRows.forEach((row) => {
          if (!servicesMap.has(row.order_id)) {
            servicesMap.set(row.order_id, []);
          }
          servicesMap.get(row.order_id).push({
            service_id: row.service_id,
            service_name: row.service_name,
            service_description: row.service_description,
            service_price: parseFloat(row.service_price),
            service_completed: Boolean(row.service_completed),
            // Add service_status here for consistency with frontend
            service_status: Boolean(row.service_completed)
              ? "completed"
              : "pending",
          });
        });

        orders.forEach((order) => {
          order.services = servicesMap.get(order.order_id) || [];
        });
      }

      return { orders, total, totalPages };
    } catch (error) {
      console.error("Error in OrderService.getAllOrders:", error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

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
          o.order_status, -- Ensure overall order_status is fetched
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

      const [serviceRows] = await connection.query(
        `
        SELECT
          os.order_service_id,
          os.service_id,
          cs.service_name,
          cs.service_description,
          cs.service_price,
          os.service_completed
        FROM order_services os
        JOIN common_services cs ON os.service_id = cs.service_id
        WHERE os.order_id = ?
        `,
        [orderId]
      );

      order.services = serviceRows.map((service) => ({
        ...service,
        service_price: parseFloat(service.service_price),
        service_completed: Boolean(service.service_completed),
        // Add service_status here for consistency with frontend
        service_status: Boolean(service.service_completed)
          ? "completed"
          : "pending",
      }));

      // Convert dates to ISO string for consistent frontend handling
      if (order.order_date)
        order.order_date = new Date(order.order_date).toISOString();
      if (order.order_estimated_completion_date)
        order.order_estimated_completion_date = new Date(
          order.order_estimated_completion_date
        ).toISOString();
      if (order.order_completion_date)
        order.order_completion_date = new Date(
          order.order_completion_date
        ).toISOString();

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
   */
  // Add to the createOrder method
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

      // Create the order
      const [orderResult] = await connection.query(
        `INSERT INTO orders (customer_id, employee_id, vehicle_id, order_status) VALUES (?, ?, ?, ?)`,
        [customer_id, employee_id, vehicle_id, "pending"]
      );
      const orderId = orderResult.insertId;

      // Create order info
      await connection.query(
        `INSERT INTO order_info (order_id, order_additional_requests) VALUES (?, ?)`,
        [orderId, additional_requests || ""]
      );

      // Process services and inventory
      if (services && services.length > 0) {
        const serviceValues = [];
        const inventoryTransactions = [];

        for (const service of services) {
          // Add service to order
          serviceValues.push([
            orderId,
            service.service_id,
            0, // service_completed starts as false
          ]);

          // Process inventory usage if any
          if (service.inventory_usage && service.inventory_usage.length > 0) {
            for (const usage of service.inventory_usage) {
              // Check current stock
              const [itemRows] = await connection.query(
                `SELECT current_quantity FROM inventory_items WHERE item_id = ?`,
                [usage.item_id]
              );

              if (itemRows.length === 0) {
                throw new Error(`Item ${usage.item_id} not found`);
              }

              const currentQty = itemRows[0].current_quantity;
              const newQty = currentQty - usage.quantity;

              if (newQty < 0) {
                throw new Error(
                  `Insufficient stock for item ${usage.item_id}. Current: ${currentQty}, Required: ${usage.quantity}`
                );
              }

              // Update inventory
              await connection.query(
                `UPDATE inventory_items SET current_quantity = ? WHERE item_id = ?`,
                [newQty, usage.item_id]
              );

              // Record transaction
              inventoryTransactions.push([
                usage.item_id,
                "outward",
                usage.quantity,
                employee_id,
                customer_id,
                orderId,
                `Used for service ${service.service_id}`,
                newQty,
              ]);
            }
          }
        }

        // Insert services
        await connection.query(
          `INSERT INTO order_services (order_id, service_id, service_completed) VALUES ?`,
          [serviceValues]
        );

        // Insert inventory transactions if any
        if (inventoryTransactions.length > 0) {
          await connection.query(
            `INSERT INTO inventory_transactions (
            item_id, transaction_type, quantity, employee_id,
            customer_id, order_id, notes, resulting_quantity
          ) VALUES ?`,
            [inventoryTransactions]
          );
        }
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
   * This method now derives the overall order_status based on individual service completion.
   */
  async updateOrder(orderId, orderData) {
    const {
      services,
      order_additional_requests,
      order_status: incomingOverallStatus,
    } = orderData;
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      let updatedCount = 0;
      let oldOrderStatus = null; // To check for status transition for email notification

      // 1. Get current overall order status before any updates
      const [currentOrderRows] = await connection.query(
        `SELECT order_status FROM orders WHERE order_id = ?`,
        [orderId]
      );
      if (currentOrderRows.length > 0) {
        oldOrderStatus = currentOrderRows[0].order_status;
      }

      // 2. Update order_info.order_additional_requests
      const [orderInfoExists] = await connection.query(
        `SELECT 1 FROM order_info WHERE order_id = ?`,
        [orderId]
      );

      if (order_additional_requests !== undefined) {
        if (orderInfoExists.length > 0) {
          const [result] = await connection.query(
            `UPDATE order_info SET order_additional_requests = ? WHERE order_id = ?`,
            [order_additional_requests, orderId]
          );
          updatedCount += result.affectedRows;
        } else {
          const [result] = await connection.query(
            `INSERT INTO order_info (order_id, order_additional_requests) VALUES (?, ?)`,
            [orderId, order_additional_requests]
          );
          updatedCount += result.affectedRows;
        }
      }

      // 3. Update individual services (delete and re-insert is a common strategy for many-to-many updates)
      if (services && Array.isArray(services)) {
        await connection.query(
          `DELETE FROM order_services WHERE order_id = ?`,
          [orderId]
        );
        updatedCount++; // Count the delete operation as an update

        if (services.length > 0) {
          const serviceValues = services.map((service) => [
            orderId,
            service.service_id,
            service.service_completed ? 1 : 0, // Store as 1 or 0
          ]);
          const [result] = await connection.query(
            `INSERT INTO order_services (order_id, service_id, service_completed) VALUES ?`,
            [serviceValues]
          );
          updatedCount += result.affectedRows;
        }
      }

      // 4. Derive overall order_status based on updated individual services
      let newOverallStatus = incomingOverallStatus; // Start with what frontend sent

      // Fetch the *current* completion status of all services for this order
      const [allServicesForOrder] = await connection.query(
        `SELECT service_completed FROM order_services WHERE order_id = ?`,
        [orderId]
      );

      if (allServicesForOrder.length > 0) {
        const allCompleted = allServicesForOrder.every(
          (s) => s.service_completed === 1
        );

        // Apply derivation logic based on user's requirements
        if (incomingOverallStatus === "cancelled") {
          // If admin explicitly set to cancelled, respect that.
          newOverallStatus = "cancelled";
        } else if (allCompleted) {
          newOverallStatus = "completed";
        } else {
          // If not all completed, it's pending (as per user's rule for display)
          // If you want 'in_progress' to be derived if some are completed, add that logic here.
          newOverallStatus = "pending";
        }
      } else {
        // If there are no services associated with the order, it's pending by default
        if (incomingOverallStatus !== "cancelled") {
          newOverallStatus = "pending";
        }
      }

      // 5. Update orders.order_status and order_info.order_completion_date
      const [orderUpdateResult] = await connection.query(
        `UPDATE orders SET order_status = ? WHERE order_id = ?`,
        [newOverallStatus, orderId]
      );
      updatedCount += orderUpdateResult.affectedRows;

      // If status changed to completed, set completion date
      if (newOverallStatus === "completed" && oldOrderStatus !== "completed") {
        await connection.query(
          `UPDATE order_info SET order_completion_date = NOW() WHERE order_id = ?`,
          [orderId]
        );
        updatedCount++;

        // Trigger email notification
        this.sendCompletionNotification(orderId).catch((err) =>
          console.error("Failed to send completion notification:", err)
        );
      } else if (
        newOverallStatus !== "completed" &&
        oldOrderStatus === "completed"
      ) {
        // If status changed from completed to something else, clear completion date
        await connection.query(
          `UPDATE order_info SET order_completion_date = NULL WHERE order_id = ?`,
          [orderId]
        );
        updatedCount++;
      }

      await connection.commit();
      return updatedCount > 0;
    } catch (error) {
      await connection.rollback();
      console.error(
        `Error in OrderService.updateOrder for orderId ${orderId}:`,
        error
      );
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  // Removed updateOrderStatus as its logic is now within updateOrder

  /**
   * Sends completion notification email for an order.
   * This is called internally by updateOrder when status transitions to 'completed'.
   */
  async sendCompletionNotification(orderId) {
    let connection;
    try {
      connection = await pool.getConnection();

      const [orderRows] = await connection.query(
        `SELECT
          o.order_id,
          c.customer_email,
          ci.customer_first_name,
          ci.customer_last_name,
          oi.order_completion_date
        FROM orders o
        JOIN customer_identifier c ON o.customer_id = c.customer_id
        JOIN customer_info ci ON c.customer_id = ci.customer_id
        LEFT JOIN order_info oi ON o.order_id = oi.order_id
        WHERE o.order_id = ?`,
        [orderId]
      );

      if (orderRows.length > 0) {
        const order = orderRows[0];
        const customerName = `${order.customer_first_name} ${order.customer_last_name}`;
        const completionDate =
          order.order_completion_date || new Date().toISOString().split("T")[0];

        await emailService.sendOrderCompletionEmail(
          order.customer_email,
          customerName,
          order.order_id,
          completionDate
        );
      }
    } catch (error) {
      console.error(
        `Error sending completion notification for order ${orderId}:`,
        error
      );
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = new OrderService();
