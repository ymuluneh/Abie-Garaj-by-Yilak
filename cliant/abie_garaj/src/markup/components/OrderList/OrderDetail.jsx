import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderById,
  updateOrder,
  updateOrderStatus,
} from "../../../services/api";
import styles from "./OrderDetail.module.css";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");
  const [additionalRequests, setAdditionalRequests] = useState("");
  const [services, setServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);

  useEffect(() => {
    fetchOrder();
    fetchServices();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await getOrderById(id);
      setOrder(response.data);
      setStatus(response.data.order_status);
      setAdditionalRequests(response.data.order_additional_requests || "");
      setServices(
        response.data.services.map((service) => ({
          ...service,
          completed: service.service_completed,
        }))
      );
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      // You'll need to implement getServices API function
      const response = await getServices();
      setAvailableServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      setStatus(newStatus);
      setOrder({ ...order, order_status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
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
    try {
      await updateOrder(id, {
        services: services.map((service) => ({
          service_id: service.service_id,
          service_completed: service.completed,
        })),
        additional_requests: additionalRequests,
      });
      setEditing(false);
      fetchOrder(); // Refresh data
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  if (loading) return <div>Loading order details...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Order #{order.order_id}</h1>
        <div className={styles.statusContainer}>
          <span className={styles.statusLabel}>Status:</span>
          {editing ? (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={styles.statusSelect}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          ) : (
            <span
              className={styles.statusBadge}
              style={{
                backgroundColor: {
                  pending: "orange",
                  in_progress: "blue",
                  completed: "green",
                  cancelled: "red",
                }[status],
              }}
            >
              {status.replace("_", " ")}
            </span>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Customer Information</h2>
        <div className={styles.infoGrid}>
          <div>
            <label>Name:</label>
            <p>
              {order.customer_first_name} {order.customer_last_name}
            </p>
          </div>
          <div>
            <label>Email:</label>
            <p>{order.customer_email}</p>
          </div>
          <div>
            <label>Phone:</label>
            <p>{order.customer_phone_number}</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Vehicle Information</h2>
        <div className={styles.infoGrid}>
          <div>
            <label>Vehicle:</label>
            <p>
              {order.vehicle_year} {order.vehicle_make} {order.vehicle_model}
            </p>
          </div>
          <div>
            <label>License Plate:</label>
            <p>{order.vehicle_tag}</p>
          </div>
          <div>
            <label>Mileage:</label>
            <p>{order.vehicle_mileage} miles</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Requested Services</h2>
        <div className={styles.servicesList}>
          {services.map((service) => (
            <div key={service.service_id} className={styles.serviceItem}>
              {editing ? (
                <label className={styles.serviceCheckbox}>
                  <input
                    type="checkbox"
                    checked={service.completed}
                    onChange={(e) =>
                      handleServiceToggle(service.service_id, e.target.checked)
                    }
                  />
                  <span>{service.service_name}</span>
                </label>
              ) : (
                <>
                  <span>{service.service_name}</span>
                  <span
                    className={`${styles.serviceStatus} ${
                      service.completed ? styles.completed : styles.pending
                    }`}
                  >
                    {service.completed ? "Completed" : "Pending"}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Additional Requests</h2>
        {editing ? (
          <textarea
            value={additionalRequests}
            onChange={(e) => setAdditionalRequests(e.target.value)}
            className={styles.additionalTextarea}
            placeholder="Enter any additional requests..."
          />
        ) : (
          <p>{additionalRequests || "No additional requests"}</p>
        )}
      </div>

      <div className={styles.actions}>
        {editing ? (
          <>
            <button onClick={handleSave} className={styles.saveButton}>
              Save Changes
            </button>
            <button
              onClick={() => setEditing(false)}
              className={styles.cancelButton}
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
              onClick={() => navigate("/orders")}
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
