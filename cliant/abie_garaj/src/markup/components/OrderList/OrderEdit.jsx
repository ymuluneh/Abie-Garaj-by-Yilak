// src/markup/components/OrderEdit/OrderEdit.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrder } from "../../../services/api";
import styles from "./OrderEdit.module.css";

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for editable fields
  const [currentOrderStatus, setCurrentOrderStatus] = useState("");
  const [additionalRequests, setAdditionalRequests] = useState("");
  const [services, setServices] = useState([]); // State to manage individual services

  const orderStatusOptions = [
    "pending",
    "in_progress",
    "completed",
    "cancelled",
  ];

  // Helper function to format status strings for display
  const displayStatus = useCallback((statusKey) => {
    if (!statusKey) return "N/A";
    return statusKey
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, []);

  // Fetch order details on component mount or ID change
  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrderById(id);
      if (response.data) {
        setOrder(response.data);
        setCurrentOrderStatus(response.data.order_status); // Initialize overall status from backend
        setAdditionalRequests(response.data.order_additional_requests || "");

        setServices(
          response.data.services.map((service) => ({
            ...service,
            completed: Boolean(service.service_completed),
            service_status:
              service.service_status ||
              (Boolean(service.service_completed) ? "completed" : "pending"),
          }))
        );
      } else {
        setError("Order not found.");
      }
    } catch (err) {
      console.error("Error fetching order details for edit:", err);
      setError("Failed to load order details for editing.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Logic to suggest overall order status based on individual service completion
  useEffect(() => {
    if (services.length > 0) {
      const allServicesCompleted = services.every(
        (service) => service.completed
      );

      // Only auto-set if the current status isn't manually set to 'cancelled'
      if (currentOrderStatus !== "cancelled") {
        if (allServicesCompleted) {
          setCurrentOrderStatus("completed");
        } else {
          // If not all services are completed, set to 'pending' or 'in_progress'
          // We default to 'pending' as per the user's explicit rule for the overall status display.
          // If you want 'in_progress' to be automatically suggested if *some* services are done,
          // you'd add: `else if (services.some(service => service.completed)) { setCurrentOrderStatus("in_progress"); }`
          // but the rule states "Pending" if *any* is not completed.
          setCurrentOrderStatus("pending");
        }
      }
    }
  }, [services, currentOrderStatus]); // Depend on services and currentOrderStatus

  // Handle individual service completion toggle
  const handleServiceToggle = (serviceId, isCompleted) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.service_id === serviceId
          ? {
              ...service,
              completed: isCompleted,
              service_status: isCompleted ? "completed" : "pending",
            }
          : service
      )
    );
  };

  // Handle form submission to update the order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedOrderData = {
        order_status: currentOrderStatus, // Send the chosen/derived overall status
        order_additional_requests: additionalRequests,
        services: services.map((service) => ({
          service_id: service.service_id,
          service_completed: service.completed,
          service_status: service.service_status,
        })),
      };

      await updateOrder(id, updatedOrderData); // Send to backend

      alert("Order updated successfully!");
      navigate(`/admin/orders/${id}`); // Redirect back to the order detail page after save
    } catch (err) {
      console.error("Error updating order:", err);
      setError("Failed to update order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Display loading, error, or not found states
  if (loading) {
    return (
      <div className={styles.loading}>Loading order details for edit...</div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!order) {
    return <div className={styles.notFound}>Order not found.</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Edit Order #{order.order_id}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Customer Information (Read-Only) */}
        <div className={styles.formGroup}>
          <label>Customer Name:</label>
          <input
            type="text"
            value={`${order.customer_first_name} ${order.customer_last_name}`}
            readOnly
            className={styles.readOnlyInput}
          />
        </div>

        {/* Vehicle Information (Read-Only) */}
        <div className={styles.formGroup}>
          <label>Vehicle:</label>
          <input
            type="text"
            value={`${order.vehicle_year} ${order.vehicle_make} ${order.vehicle_model}`}
            readOnly
            className={styles.readOnlyInput}
          />
        </div>

        {/* Overall Order Status (Editable) */}
        <div className={styles.formGroup}>
          <label htmlFor="orderStatus">Overall Order Status:</label>
          <select
            id="orderStatus"
            value={currentOrderStatus}
            onChange={(e) => setCurrentOrderStatus(e.target.value)}
            className={styles.select}
            disabled={loading}
          >
            {orderStatusOptions.map((status) => (
              <option key={status} value={status}>
                {displayStatus(status)}
              </option>
            ))}
          </select>
        </div>

        {/* Manage Services Section (Editable) */}
        <div className={styles.section}>
          <h2>Manage Services</h2>
          {services.length > 0 ? (
            <div className={styles.servicesList}>
              {services.map((service) => (
                <div key={service.service_id} className={styles.serviceItem}>
                  <div className={styles.serviceDetails}>
                    <h4>{service.service_name}</h4>
                    <p>{service.service_description || "No description"}</p>
                  </div>
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
                      disabled={loading}
                    />
                    <span>Completed</span>
                  </label>
                  <span
                    className={`${styles.statusTag} ${
                      service.service_status === "completed"
                        ? styles.completedTag
                        : styles.pendingTag
                    }`}
                  >
                    {displayStatus(service.service_status)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No services associated with this order.</p>
          )}
        </div>

        {/* Additional Requests (Editable) */}
        <div className={styles.formGroup}>
          <label htmlFor="additionalRequests">Additional Requests:</label>
          <textarea
            id="additionalRequests"
            value={additionalRequests}
            onChange={(e) => setAdditionalRequests(e.target.value)}
            className={styles.textarea}
            rows="5"
            disabled={loading}
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate(`/admin/orders/${id}`)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderEdit;
