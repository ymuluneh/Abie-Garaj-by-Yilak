// src/markup/components/OrderList/OrderDetail.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../../../services/api";
import styles from "./OrderDetail.module.css";
import PropTypes from "prop-types";

// Import Material-UI components for the Receipt Dialog
import {
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Grid,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Print as PrintIcon, Close as CloseIcon } from "@mui/icons-material";

const OrderDetail = ({ isAdmin }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]); // State to hold services for display

  // State and refs for Material-UI Dialog for receipt
  const [receiptOpen, setReceiptOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md")); // For responsive dialog

  // Map status to display names for better readability on main page
  const displayStatus = (statusKey) => {
    if (!statusKey) return "N/A";
    return statusKey
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Map status to colors for badges on main page
  const statusColors = {
    pending: "#ffc107", // Amber/Orange
    in_progress: "#007bff", // Blue (though we'll derive to pending/completed)
    completed: "#28a745", // Green
    cancelled: "#dc3545", // Red (will be manually set by admin)
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrderById(id);
      if (response.data) {
        setOrder(response.data);
        // Ensure `service_completed` is a boolean and `service_status` exists for individual service display
        setServices(
          response.data.services.map((service) => ({
            ...service,
            completed: Boolean(service.service_completed),
            // Use service_completed to determine individual service display status
            service_status: Boolean(service.service_completed)
              ? "completed"
              : "pending",
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

  // Overall order status derived from individual service statuses, as per requirement
  const derivedOverallOrderStatus = useMemo(() => {
    if (!services || services.length === 0) {
      return "Pending"; // If no services, consider it pending
    }
    const allServicesCompleted = services.every((service) => service.completed);
    // If the backend has explicitly set 'cancelled', prioritize that display
    if (order && order.order_status === "cancelled") {
      return "Cancelled";
    }
    return allServicesCompleted ? "Completed" : "Pending";
  }, [services, order]); // Depend on services and the order object itself for cancelled status

  // Calculate subtotal, tax, and total for receipt (using service_price from fetched services)
  const receiptCalculations = useMemo(() => {
    const subtotal = services.reduce(
      (sum, service) => sum + parseFloat(service?.service_price || 0),
      0
    );
    const taxRate = 0.1; // 10% tax rate
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    };
  }, [services]);

  // Handlers for Receipt Dialog
  const handlePrintReceipt = () => {
    setReceiptOpen(true);
  };

  const handleCloseReceipt = () => {
    setReceiptOpen(false);
  };

  const handleActualPrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid date"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  if (loading)
    return (
      <div className={styles.loading}>
        <CircularProgress />
        <p>Loading order details...</p>
      </div>
    );
  if (error)
    return (
      <Alert severity="error" sx={{ margin: 2 }}>
        {error}
      </Alert>
    );
  if (!order)
    return (
      <Alert severity="warning" sx={{ margin: 2 }}>
        Order not found.
      </Alert>
    );

  return (
    <div className={styles.container}>
      {/* Main Order Detail Page Content */}
      <div className={styles.header}>
        <div className={styles.mainTitle}>
          <h1>
            Order Details for {order.customer_first_name}{" "}
            {order.customer_last_name}
          </h1>
          <span
            className={styles.overallStatusBadge}
            style={{
              backgroundColor:
                statusColors[derivedOverallOrderStatus.toLowerCase()] || "#ccc",
            }}
          >
            {derivedOverallOrderStatus}
          </span>
        </div>
        <p className={styles.trackingText}>
          You can track the progress of your order using this page. We will
          constantly update this page to let you know how we are progressing. As
          soon as we are done with the order, the status will turn green. That
          means, your car is ready for pickup.
        </p>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.infoSectionsWrapper}>
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
      </div>

      <div className={styles.section}>
        <h2>ORDER DETAILS</h2>
        <div className={styles.orderInfoGrid}>
          <p>
            <strong>Order Date:</strong> {formatDate(order.order_date)}
          </p>
          <p>
            <strong>Order ID:</strong> {order.order_id}
          </p>
          <p>
            <strong>Estimated Completion:</strong>{" "}
            {order.order_estimated_completion_date
              ? formatDate(order.order_estimated_completion_date)
              : "N/A"}
          </p>
          <p>
            <strong>Received by:</strong>{" "}
            {order.employee_first_name && order.employee_last_name
              ? `${order.employee_first_name} ${order.employee_last_name}`
              : "N/A"}
          </p>
        </div>

        <h3 className={styles.subheading}>Requested Service(s)</h3>
        <div className={styles.servicesList}>
          {services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.order_service_id}
                className={styles.serviceItem}
              >
                <div>
                  <h4>{service.service_name}</h4>
                  <p>
                    {service.service_description || "No description available"}
                  </p>
                </div>
                {/* Individual service status display */}
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
            ))
          ) : (
            <p>No services associated with this order.</p>
          )}
        </div>

        
      </div>

      {/* Action Buttons - at the bottom */}
      <div className={styles.actions}>
        {isAdmin && (
          <button
            onClick={() => navigate(`/admin/orders/edit/${order.order_id}`)}
            className={styles.editButton}
          >
            Edit Order
          </button>
        )}
        <button onClick={handlePrintReceipt} className={styles.printButton}>
          Print Receipt
        </button>
        <button
          onClick={() => navigate("/admin/orders")}
          className={styles.backButton}
        >
          Back to Orders
        </button>
      </div>

      {/* Material-UI Receipt Dialog */}
      <Dialog
        fullScreen={fullScreen}
        open={receiptOpen}
        onClose={handleCloseReceipt}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Order Receipt</Typography>
            <IconButton onClick={handleCloseReceipt}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {/* Content for the actual receipt printout */}
          <div className={styles.receiptPrintArea}>
            <div className={styles.receiptHeaderPrint}>
              <Typography variant="h5" className={styles.receiptTitlePrint}>
                ARE GARAGE
              </Typography>
              <Typography variant="subtitle1" sx={{ marginBottom: "5px" }}>
                548 Telatain Town, 5238 MT. La City, IA 52264
              </Typography>
              <Typography variant="subtitle1">
                Email: contact@autorex.com | Call us on: +1 800 456 7890
              </Typography>
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  Order ID: {order.order_id}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  Order Date: {formatDate(order.order_date)}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  Completion Date:{" "}
                  {order.order_completion_date
                    ? formatDate(order.order_completion_date)
                    : "N/A"}
                </Typography>
              </Box>
            </div>

            <Divider sx={{ marginY: 2 }} />

            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Customer Information
                </Typography>
                <Typography>
                  {order.customer_first_name} {order.customer_last_name}
                </Typography>
                <Typography>{order.customer_email}</Typography>
                <Typography>{order.customer_phone_number}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Vehicle Information
                </Typography>
                <Typography>
                  {order.vehicle_year} {order.vehicle_make}{" "}
                  {order.vehicle_model}
                </Typography>
                <Typography>License: {order.vehicle_tag || "N/A"}</Typography>
                <Typography>
                  Mileage:{" "}
                  {order.vehicle_mileage
                    ? `${order.vehicle_mileage} miles`
                    : "N/A"}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ marginY: 2 }} />

            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Services
            </Typography>
            <Box>
              {services.length > 0 ? (
                services.map((service, index) => (
                  <Box
                    key={service.service_id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 1,
                      paddingBottom: 1,
                      borderBottom: "1px dotted #eee",
                    }}
                  >
                    <Box sx={{ flexGrow: 1, pr: 2 }}>
                      <Typography fontWeight="medium">
                        {index + 1}. {service.service_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {service.service_description || "No description"}
                      </Typography>
                    </Box>
                    <Typography fontWeight="bold">
                      ${parseFloat(service.service_price || 0).toFixed(2)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography>No services listed.</Typography>
              )}
            </Box>

            {order.order_additional_requests && (
              <Box sx={{ marginTop: 3 }}>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  Additional Requests
                </Typography>
                <Typography>{order.order_additional_requests}</Typography>
              </Box>
            )}

            <Divider sx={{ marginY: 3 }} />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "250px",
                  mb: 1,
                }}
              >
                <Typography>Subtotal:</Typography>
                <Typography fontWeight="bold">
                  ${receiptCalculations.subtotal}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "250px",
                  mb: 1,
                }}
              >
                <Typography>
                  Tax (
                  {(
                    (receiptCalculations.tax /
                      (parseFloat(receiptCalculations.subtotal) || 1)) *
                    100
                  ).toFixed(0)}
                  %):
                </Typography>
                <Typography fontWeight="bold">
                  ${receiptCalculations.tax}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "250px",
                  mb: 1,
                }}
              >
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" fontWeight="bold">
                  ${receiptCalculations.total}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ marginY: 3 }} />

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2">
                Thank you for your business!
              </Typography>
              <Typography variant="body2">Please come again</Typography>
            </Box>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReceipt}>Close</Button>
          <Button
            onClick={handleActualPrint}
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
          >
            Print Receipt
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// PropTypes for isAdmin
OrderDetail.propTypes = {
  isAdmin: PropTypes.bool,
};

// Default prop for isAdmin if not provided, for public view
OrderDetail.defaultProps = {
  isAdmin: false,
};

export default OrderDetail;
