import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../../../services/api";
import styles from "./OrderList.module.css";

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
      setOrders(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
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
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.order_id}>
                      <td>{order.order_id}</td>
                      <td>
                        {order.customer_first_name} {order.customer_last_name}
                      </td>
                      <td>
                        {order.vehicle_year} {order.vehicle_make}{" "}
                        {order.vehicle_model}
                      </td>
                      <td>{new Date(order.order_date).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={{
                            backgroundColor: statusColors[order.order_status],
                          }}
                        >
                          {order.order_status.replace("_", " ")}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/order/${order.order_id}`}
                          className={styles.viewButton}
                        >
                          View/Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className={styles.noOrders}>
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
