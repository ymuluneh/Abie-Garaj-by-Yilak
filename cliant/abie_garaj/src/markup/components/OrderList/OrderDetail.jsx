// src/markup/components/OrderList/OrderDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderById,
  updateOrder,
  updateOrderStatus, // Keep if you want a separate quick status update, but updateOrder can handle it
} from "../../../services/api";
import styles from "./OrderDetail.module.css";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state
  const [editing, setEditing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(""); // Renamed from 'status' to avoid conflict with handleStatusChange param
  const [additionalRequests, setAdditionalRequests] = useState("");
  const [services, setServices] = useState([]);

  // Define possible order statuses (must match backend enum values)
  const orderStatusOptions = [
    "pending",
    "in_progress", // Corrected to match backend enum
    "completed",
    "cancelled",
  ];

  // Map status to display names for better readability
  const displayStatus = (statusKey) => {
    return statusKey
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Map status to colors for badges
  const statusColors = {
    pending: "#ffc107", // Amber/Orange
    in_progress: "#007bff", // Blue
    completed: "#28a745", // Green
    cancelled: "#dc3545", // Red
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await getOrderById(id);
      if (response.data) {
        setOrder(response.data);
        setCurrentStatus(response.data.order_status);
        setAdditionalRequests(response.data.order_additional_requests || "");
        setServices(
          response.data.services.map((service) => ({
            ...service,
            completed: Boolean(service.service_completed), // Ensure boolean
          }))
        );
      } else {
        setError("Order not found.");
        setOrder(null);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to load order details. Please try again.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  // This function would be for immediate status change outside of "edit" mode
  // Keeping it, but demonstrating how updateOrder can also handle status
  const handleStatusQuickChange = async (newStatus) => {
    if (
      window.confirm(
        `Are you sure you want to change the order status to "${displayStatus(
          newStatus
        )}"?`
      )
    ) {
      try {
        setLoading(true); // Show loading while updating
        await updateOrderStatus(id, newStatus); // Use dedicated status update API
        setCurrentStatus(newStatus);
        setOrder({ ...order, order_status: newStatus }); // Update local state immediately
        alert("Order status updated successfully!");
      } catch (error) {
        console.error("Error updating status:", error);
        alert("Failed to update status. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleServiceToggle = (serviceId, completed) => {
    setServices(
      services.map((service) =>
        service.service_id === serviceId ? { ...service, completed } : service
      )
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateOrder(id, {
        status: currentStatus, // Send the current status from state
        additional_requests: additionalRequests,
        services: services.map((service) => ({
          service_id: service.service_id,
          service_completed: service.completed, // Send boolean
        })),
      });
      setEditing(false);
      alert("Order updated successfully!");
      // No need to fetchOrder again immediately if state is already updated correctly
      // but it's a safe fallback if multiple things can change or if you're uncertain
      // fetchOrder();
    } catch (error) {
      console.error("Error updating order:", error);
      setError("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className={styles.loading}>Loading order details...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!order) return <div className={styles.notFound}>Order not found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          Order Details for {order.customer_first_name}{" "}
          {order.customer_last_name}
        </h1>
        <p>
          You can track the progress of your order using this page. We will
          constantly update this page to let you know how we are progressing. As
          soon as we are done with the order, the status will turn green. That
          means, your car is ready for pickup.
        </p>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.section}>
        <h2>CUSTOMER INFORMATION</h2>
        <h3>
          {order.customer_first_name} {order.customer_last_name}
        </h3>
        <div className={styles.infoGrid}>
          <p>
            <strong>Email:</strong> {order.customer_email}
          </p>
          <p>
            <strong>Phone Number:</strong> {order.customer_phone_number}
          </p>
          {/* Removed "Active Customer" as it's not in your schema */}
        </div>
      </div>

      <div className={styles.section}>
        <h2>VEHICLE INFORMATION</h2>
        <h3>
          {order.vehicle_year} {order.vehicle_make} {order.vehicle_model}
        </h3>
        <div className={styles.infoGrid}>
          <p>
            <strong>Vehicle tag:</strong> {order.vehicle_tag || "N/A"}
          </p>
          <p>
            <strong>Vehicle year:</strong> {order.vehicle_year || "N/A"}
          </p>
          <p>
            <strong>Vehicle mileage:</strong>{" "}
            {order.vehicle_mileage ? `${order.vehicle_mileage} miles` : "N/A"}
          </p>
        </div>
      </div>

      <div className={styles.section}>
        <h2>ORDER DETAILS</h2>
        <div className={styles.orderInfoGrid}>
          <p>
            <strong>Order ID:</strong> {order.order_id}
          </p>
          <p>
            <strong>Order Date:</strong> {order.order_date}
          </p>
          <p>
            <strong>Estimated Completion:</strong>{" "}
            {order.order_estimated_completion_date || "N/A"}
          </p>
          <p>
            <strong>Completion Date:</strong>{" "}
            {order.order_completion_date || "N/A"}
          </p>
          <p>
            <strong>Received by:</strong>{" "}
            {order.employee_first_name && order.employee_last_name
              ? `${order.employee_first_name} ${order.employee_last_name}`
              : "N/A"}
          </p>
          <p>
            <strong>Total Price:</strong>{" "}
            {order.order_total_price ? `$${order.order_total_price}` : "N/A"}
          </p>
        </div>

        <h3 className={styles.subheading}>
          Current Order Status:{" "}
          <span
            className={styles.statusBadge}
            style={{ backgroundColor: statusColors[currentStatus] || "#ccc" }}
          >
            {displayStatus(currentStatus)}
          </span>
        </h3>

        {editing && (
          <div className={styles.formGroup}>
            <label htmlFor="orderStatus">Update Status:</label>
            <select
              id="orderStatus"
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)} // Update local state for save
              className={styles.statusSelect}
            >
              {orderStatusOptions.map((optStatus) => (
                <option key={optStatus} value={optStatus}>
                  {displayStatus(optStatus)}
                </option>
              ))}
            </select>
          </div>
        )}

        <h3 className={styles.subheading}>Requested Service(s)</h3>
        <div className={styles.servicesList}>
          {services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.order_service_id}
                className={styles.serviceItem}
              >
                <h4>{service.service_name}</h4>
                <p>
                  {service.service_description || "No description available"}
                </p>
                {editing && (
                  <label className={styles.serviceCheckbox}>
                    <input
                      type="checkbox"
                      checked={service.completed}
                      onChange={(e) =>
                        handleServiceToggle(
                          service.service_id,
                          e.target.checked
                        )
                      }
                    />
                    <span>Service Completed</span>
                  </label>
                )}
                {!editing && service.completed && (
                  <span className={styles.completedTag}>Completed</span>
                )}
              </div>
            ))
          ) : (
            <p>No services associated with this order.</p>
          )}
        </div>

        <h3 className={styles.subheading}>Additional Requests</h3>
        {editing ? (
          <textarea
            value={additionalRequests}
            onChange={(e) => setAdditionalRequests(e.target.value)}
            className={styles.additionalTextarea}
            placeholder="Enter any additional requests..."
            rows="5"
          />
        ) : (
          <p>{additionalRequests || "No additional requests"}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                fetchOrder(); // Re-fetch to discard unsaved changes and reset state
              }}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className={styles.editButton}
            >
              Edit Order
            </button>
            <button
              onClick={() => navigate("/admin/orders")}
              className={styles.backButton}
            >
              Back to Orders
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
