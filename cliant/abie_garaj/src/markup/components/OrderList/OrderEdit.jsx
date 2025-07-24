// components/admin/OrderEdit/OrderEdit.jsx (Example Path)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderById,
  updateOrder,
  updateOrderStatus,
} from "../../../services/api"; // Import necessary API calls
import styles from "./OrderEdit.module.css"; // Create this CSS module

const OrderEdit = () => {
  const { id } = useParams(); // Get order ID from URL
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const [additionalRequests, setAdditionalRequests] = useState(""); // Example for another field

  const orderStatuses = ["pending", "in_progress", "completed", "cancelled"];

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getOrderById(id);
        setOrder(response.data); // Assuming response.data is the order object
        setCurrentStatus(response.data.order_status);
        setAdditionalRequests(response.data.order_additional_requests || "");
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = (e) => {
    setCurrentStatus(e.target.value);
  };

  const handleAdditionalRequestsChange = (e) => {
    setAdditionalRequests(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // You can choose to update just the status or the entire order
      // Using updateOrder to send all potentially changed fields (status, additional requests)
      await updateOrder(id, {
        status: currentStatus,
        additional_requests: additionalRequests,
        // Include other fields if your form allows editing them
      });

      // If you only want to update status:
      // await updateOrderStatus(id, currentStatus);

      alert("Order updated successfully!");
      navigate(`/admin/orders/${id}`); // Redirect back to order detail or list
    } catch (err) {
      console.error("Error updating order:", err);
      setError("Failed to update order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading order details...</div>;
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
        <div className={styles.formGroup}>
          <label>Customer Name:</label>
          <input
            type="text"
            value={`${order.customer_first_name} ${order.customer_last_name}`}
            readOnly
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="orderStatus">Order Status:</label>
          <select
            id="orderStatus"
            value={currentStatus}
            onChange={handleStatusChange}
            className={styles.select}
            disabled={loading}
          >
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status
                  .replace(/_/g, " ")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="additionalRequests">Additional Requests:</label>
          <textarea
            id="additionalRequests"
            value={additionalRequests}
            onChange={handleAdditionalRequestsChange}
            className={styles.textarea}
            rows="5"
            disabled={loading}
          ></textarea>
        </div>

        {/* Add more fields here for other editable order details (e.g., total price, estimated completion date) */}

        <button type="submit" className={styles.saveButton} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default OrderEdit;
