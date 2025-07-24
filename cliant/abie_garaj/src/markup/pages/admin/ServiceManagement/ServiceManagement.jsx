import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  CircularProgress, // Added for loading indicator
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../../../../services/api"; // Adjust path as needed

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [newServiceData, setNewServiceData] = useState({
    service_name: "",
    service_description: "",
    service_price: "", // Initialize as empty string for TextField
  });
  const [editingServiceId, setEditingServiceId] = useState(null); // ID of service being edited
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // General error state for API calls

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError("");
    try {
      // The getServices API call now fetches active services by default
      const data = await getServices();
      setServices(data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setError("Failed to fetch services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewServiceChange = (e) => {
    const { name, value } = e.target;
    setNewServiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateService = async () => {
    setError(""); // Clear form-specific errors
    // Basic validation
    if (
      !newServiceData.service_name ||
      !newServiceData.service_description ||
      newServiceData.service_price === "" // Check for empty string
    ) {
      setError("Please fill in all fields (Name, Description, Price).");
      return;
    }
    const price = parseFloat(newServiceData.service_price);
    if (isNaN(price) || price < 0) {
      setError("Service price must be a valid non-negative number.");
      return;
    }

    try {
      if (editingServiceId) {
        // Update existing service
        await updateService(editingServiceId, {
          service_name: newServiceData.service_name,
          service_description: newServiceData.service_description,
          service_price: price, // Pass as number
        });
        setSnackbar({
          open: true,
          message: "Service updated successfully!",
          severity: "success",
        });
      } else {
        // Create new service
        await createService({
          service_name: newServiceData.service_name,
          service_description: newServiceData.service_description,
          service_price: price, // Pass as number
        });
        setSnackbar({
          open: true,
          message: "Service added successfully!",
          severity: "success",
        });
      }
      // Reset form and editing state
      setNewServiceData({
        service_name: "",
        service_description: "",
        service_price: "",
      });
      setEditingServiceId(null);
      fetchServices(); // Refresh list
    } catch (err) {
      console.error("Error saving service:", err);
      setError(
        "Error saving service: " + (err.response?.data?.message || err.message)
      );
      setSnackbar({
        open: true,
        message: "Error saving service!",
        severity: "error",
      });
    }
  };

  const handleEditClick = (service) => {
    setEditingServiceId(service.service_id);
    setNewServiceData({
      service_name: service.service_name,
      service_description: service.service_description,
      service_price: service.service_price.toString(), // Ensure price is string for TextField
    });
    setError(""); // Clear any previous errors when starting edit
    // Optionally, scroll to the form
    // Adding a slight delay to ensure scroll happens after state update and re-render
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const handleDeleteService = async (serviceId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this service? If it's linked to orders, it will be marked inactive instead of fully deleted."
      )
    ) {
      try {
        await deleteService(serviceId);
        setSnackbar({
          open: true,
          message:
            "Service processed for deletion (marked inactive if linked) successfully!",
          severity: "success",
        });
        fetchServices(); // Refresh list to reflect changes
      } catch (err) {
        console.error(`Error deleting service with ID ${serviceId}:`, err);
        // Display a more user-friendly error from the backend if available
        setSnackbar({
          open: true,
          message:
            "Error deleting service! " +
            (err.response?.data?.message || err.message),
          severity: "error",
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setNewServiceData({
      service_name: "",
      service_description: "",
      service_price: "",
    });
    setError("");
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress />
      </Box>
    );
  // Only show general error if no services loaded and no snackbar is active
  if (error && services.length === 0 && !snackbar.open)
    return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Services We Provide
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage the list of services offered by your garage. You can add new
        services, update existing ones, or mark them as inactive if they are no
        longer offered but are linked to past orders.
      </Typography>

      <Box sx={{ mb: 4 }}>
        {services.length === 0 ? (
          <Typography>
            No active services found. Use the form below to add one!
          </Typography>
        ) : (
          services.map((service) => (
            <Accordion
              key={service.service_id}
              component={Paper}
              elevation={1}
              sx={{ mb: 1 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${service.service_id}-content`}
                id={`panel-${service.service_id}-header`}
                component="div"
              >
                <Grid container alignItems="center" sx={{ width: "100%" }}>
                  <Grid item xs={9}>
                    <Typography variant="h6">{service.service_name}</Typography>
                  </Grid>
                  <Grid item xs={3} display="flex" justifyContent="flex-end">
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", mr: 2 }}
                    >
                      ETB {parseFloat(service.service_price ?? 0).toFixed(2)}{" "}
                      {/* FIXED LINE */}
                    </Typography>
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent accordion from expanding/collapsing
                        handleEditClick(service);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent accordion from expanding/collapsing
                        handleDeleteService(service.service_id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{service.service_description}</Typography>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ mt: 5, mb: 2 }}
      >
        {editingServiceId ? "Edit Service" : "Add a New Service"}
      </Typography>
      {error && !snackbar.open && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Service Name"
              name="service_name"
              value={newServiceData.service_name}
              onChange={handleNewServiceChange}
              variant="outlined"
              margin="normal"
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Service Description"
              name="service_description"
              value={newServiceData.service_description}
              onChange={handleNewServiceChange}
              variant="outlined"
              multiline
              rows={4}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Service Price (ETB)"
              name="service_price"
              type="number"
              value={newServiceData.service_price}
              onChange={handleNewServiceChange}
              variant="outlined"
              margin="normal"
              size="small"
              inputProps={{ step: "0.01", min: "0" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
              {editingServiceId && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancelEdit}
                >
                  Cancel Edit
                </Button>
              )}
              <Button variant="contained" onClick={handleAddOrUpdateService}>
                {editingServiceId ? "Update Service" : "Add Service"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ServiceManagement;
