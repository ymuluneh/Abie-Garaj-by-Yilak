import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../../../services/api"; // Assuming getOrders is correctly imported
import styles from "./OrderList.module.css";
import { FaEye, FaEdit } from "react-icons/fa";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders(currentPage, 10, statusFilter);
      // Ensure response.data.data is an array. If the backend returns `response.data.data` as `null` or `undefined`,
      // set it to an empty array to prevent issues with .map()
      setOrders(response.data || []);
      setTotalPages(response.totalPages || 1); // Use response.totalPages for pagination
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const statusColors = {
    pending: "orange",
    in_progress: "blue",
    completed: "green",
    cancelled: "red",
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Orders</h1>
        <div className={styles.filters}>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className={styles.statusSelect}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading orders...</div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.orderTable}>
              <thead>
                <tr>
                  <th>Name and/or</th>
                  <th>Order Id</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Order Date</th>
                  <th>Received by</th>
                  <th>Order status</th>
                  <th>View/Edit</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    // Using a React.Fragment with a key on the outer element is correct for multiple rows per item
                    <React.Fragment key={order.order_id}>
                      <tr>
                        <td rowSpan="3">
                          {order.customer_first_name} {order.customer_last_name}
                        </td>
                        <td rowSpan="3">{order.order_id}</td>
                        <td>
                          {order.customer_first_name} {order.customer_last_name}
                        </td>
                        <td>
                          {order.vehicle_year} {order.vehicle_make}
                        </td>
                        <td rowSpan="3">
                          {/* Display the date as returned by the service (already formatted) */}
                          {order.order_date}
                        </td>
                        <td rowSpan="3">
                          {/* Display actual employee name if available, otherwise fallback */}
                          {order.employee_first_name && order.employee_last_name
                            ? `${order.employee_first_name} ${order.employee_last_name}`
                            : "Admin Belede"}
                        </td>
                        <td rowSpan="3">
                          <span
                            className={styles.statusBadge}
                            style={{
                              backgroundColor: statusColors[order.order_status],
                            }}
                          >
                            {/* Capitalize first letter and replace underscores for display */}
                            {order.order_status
                              .replace(/_/g, " ")
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </span>
                        </td>
                        <td rowSpan="3" className={styles.actionsCell}>
                          <Link
                            to={`/admin/orders/${order.order_id}`}
                            className={styles.viewButton}
                          >
                            <FaEye />
                          </Link>
                          <Link
                            to={`/admin/orders/${order.order_id}/edit`}
                            className={styles.editButton}
                          >
                            <FaEdit />
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>{order.customer_email}</td>
                        <td>{order.vehicle_model}</td>
                      </tr>
                      <tr>
                        <td>{order.customer_phone_number}</td>
                        <td>{order.vehicle_tag}</td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className={styles.noOrders}>
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {orders.length > 0 && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderList;
