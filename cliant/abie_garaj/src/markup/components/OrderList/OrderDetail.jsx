import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, getAllInventoryItems } from "../../../services/api";
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
  const [services, setServices] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);

  // State and refs for Material-UI Dialog for receipt
  const [receiptOpen, setReceiptOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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
    in_progress: "#007bff", // Blue (will often resolve to pending/completed)
    completed: "#28a745", // Green
    cancelled: "#dc3545", // Red
  };

  useEffect(() => {
    fetchOrder();
    fetchInventory();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrderById(id);
      if (response.data) {
        const orderData = response.data;

        // Calculate estimated completion date if it's not already present
        if (
          !orderData.order_estimated_completion_date &&
          orderData.order_date
        ) {
          const orderDate = new Date(orderData.order_date);
          const estimatedDate = new Date(orderDate);
          estimatedDate.setDate(orderDate.getDate() + 7); // Add 7 days
          orderData.order_estimated_completion_date =
            estimatedDate.toISOString(); // Store as ISO string
        }

        setOrder(orderData);
        // Process services to include completion status and a map for inventory usage
        setServices(
          orderData.services.map((service) => ({
            ...service,
            completed: Boolean(service.service_completed),
            service_status: Boolean(service.service_completed)
              ? "completed"
              : "pending",
            // Convert inventory_usage array to an object for easy lookup by item_id
            inventory_usage_map: (service.inventory_usage || []).reduce(
              (acc, usage) => {
                if (usage.item_id && typeof usage.quantity !== "undefined") {
                  acc[String(usage.item_id)] = usage.quantity; // Ensure item_id is a string key
                }
                return acc;
              },
              {}
            ),
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

  const fetchInventory = async () => {
    try {
      const items = await getAllInventoryItems();
      setInventoryItems(items);
    } catch (err) {
      console.error("Failed to load inventory items for receipt:", err);
    }
  };

  // Overall order status derived from individual service statuses
  const derivedOverallOrderStatus = useMemo(() => {
    if (!services || services.length === 0) {
      return "Pending";
    }
    const allServicesCompleted = services.every((service) => service.completed);
    // If the backend has explicitly set 'cancelled', prioritize that display
    if (order && order.order_status === "cancelled") {
      return "Cancelled";
    }
    return allServicesCompleted ? "Completed" : "Pending";
  }, [services, order]);

  // Calculate subtotal, tax, and total for receipt
  const receiptCalculations = useMemo(() => {
    let serviceCostTotal = 0;
    let materialsCostTotal = 0;

    services.forEach((service) => {
      // Add the base service price for each service in the order
      serviceCostTotal += parseFloat(service?.service_price || 0);

      // Calculate material costs for this service based on inventory_usage_map
      const inventoryUsageMap = service.inventory_usage_map || {};

      Object.entries(inventoryUsageMap).forEach(([itemId, quantity]) => {
        const item = inventoryItems.find(
          (invItem) => String(invItem.item_id) === String(itemId) // Ensure string comparison
        );

        if (item) {
          const itemPrice = parseFloat(item.item_price || 0);
          const quantityUsed = parseFloat(quantity || 0);
          const materialCost = itemPrice * quantityUsed;
          materialsCostTotal += materialCost;
        }
      });
    });

    const subtotal = serviceCostTotal + materialsCostTotal;
    const taxRate = 0.1; // 10% tax rate
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      serviceCostTotal: serviceCostTotal.toFixed(2), // For breakdown display
      materialsCostTotal: materialsCostTotal.toFixed(2), // For breakdown display
    };
  }, [services, inventoryItems]); // Depend on services AND inventoryItems

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
            <strong>Service Advisor:</strong>{" "}
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
                ABE GARAGE
              </Typography>
              <Typography variant="subtitle1" sx={{ marginBottom: "5px" }}>
                Ethiopia, Region 03. Bahir Dar City, kebelie 13
              </Typography>
              <Typography variant="subtitle1">
                Email: abiegarage13@gmail.com | Call us on: +251922980682
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
                    key={service.order_service_id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: 1,
                      paddingBottom: 1,
                      borderBottom: "1px dotted #eee",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography fontWeight="medium">
                        {index + 1}. {service.service_name}
                      </Typography>
                      <Typography fontWeight="bold">
                        ${parseFloat(service.service_price || 0).toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {service.service_description || "No description"}
                    </Typography>

                    {/* Display materials used for this service */}
                    {service.inventory_usage_map &&
                      Object.keys(service.inventory_usage_map).length > 0 && (
                        <Box sx={{ ml: 2, mt: 1 }}>
                          <Typography variant="body2" fontStyle="italic">
                            Materials:
                          </Typography>
                          {Object.entries(service.inventory_usage_map).map(
                            ([itemId, quantity], idx) => {
                              const item = inventoryItems.find(
                                (i) => String(i.item_id) === String(itemId)
                              );
                              if (item && parseFloat(quantity) > 0) {
                                return (
                                  <Typography
                                    key={idx}
                                    variant="body2"
                                    sx={{ ml: 1 }}
                                  >
                                    - {item.item_name} (x
                                    {parseFloat(quantity) || 0}) @ $
                                    {parseFloat(item.item_price || 0).toFixed(
                                      2
                                    )}{" "}
                                    ={" "}
                                    {(
                                      parseFloat(item.item_price || 0) *
                                      (parseFloat(quantity) || 0)
                                    ).toFixed(2)}
                                  </Typography>
                                );
                              }
                              return null;
                            }
                          )}
                        </Box>
                      )}
                  </Box>
                ))
              ) : (
                <Typography>No services listed.</Typography>
              )}
            </Box>

            {/* {order.order_additional_requests && (
              <Box sx={{ marginTop: 3 }}>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  Additional Requests
                </Typography>
                <Typography>{order.order_additional_requests}</Typography>
              </Box>
            )} */}

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
                <Typography>Services Subtotal:</Typography>
                <Typography fontWeight="bold">
                  ${receiptCalculations.serviceCostTotal}
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
                <Typography>Materials Subtotal:</Typography>
                <Typography fontWeight="bold">
                  ${receiptCalculations.materialsCostTotal}
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
                <Typography>Total Before Tax:</Typography>
                <Typography fontWeight="bold">
                  $
                  {(
                    parseFloat(receiptCalculations.serviceCostTotal) +
                    parseFloat(receiptCalculations.materialsCostTotal)
                  ).toFixed(2)}
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
                    (parseFloat(receiptCalculations.tax) /
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
          <Button onClick={handleCloseReceipt}></Button>
          <Button
            onClick={handleActualPrint}
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
          >
            Print
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

OrderDetail.defaultProps = {
  isAdmin: false,
};

export default OrderDetail;
