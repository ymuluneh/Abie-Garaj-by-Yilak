import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../../../services/api";
import styles from "./OrderList.module.css";
import { FaEye, FaEdit, FaSearch } from "react-icons/fa";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Ensure searchTerm is properly passed to the API
      const searchQuery =
        searchTerm.trim() !== "" ? searchTerm.trim() : undefined;
      const response = await getOrders(
        currentPage,
        10,
        statusFilter,
        true,
        searchQuery
      );
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout
    setSearchTimeout(
      setTimeout(() => {
        setCurrentPage(1);
      }, 500)
    );
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

      <div className={styles.searchBar}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search orders by customer, vehicle, or ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
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
                  <th>Name</th>
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
                          {new Date(order.order_date).toLocaleDateString()}
                        </td>
                        <td rowSpan="3">
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
                      {searchTerm || statusFilter
                        ? "No orders match your search criteria"
                        : "No orders found"}
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
