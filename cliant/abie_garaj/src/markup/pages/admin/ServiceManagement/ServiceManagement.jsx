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
  CircularProgress,
  Divider,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getServices,
  createService,
  updateService,
  deleteService,
  getAllInventoryItems,
  addInventoryItem,
} from "../../../../services/api";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newServiceData, setNewServiceData] = useState({
    service_name: "",
    service_description: "",
    service_price: "",
  });
  const [newInventoryItem, setNewInventoryItem] = useState({
    item_name: "",
    item_description: "",
    unit_of_measure: "pieces",
    quantity: 0,
  });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [error, setError] = useState("");
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [servicesData, inventoryData] = await Promise.all([
        getServices(),
        getAllInventoryItems(),
      ]);
      setServices(servicesData);
      setInventoryItems(inventoryData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewServiceChange = (e) => {
    const { name, value } = e.target;
    setNewServiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInventoryItemChange = (e) => {
    const { name, value } = e.target;
    setNewInventoryItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewInventoryItem = async () => {
    if (!newInventoryItem.item_name) {
      setError("Item name is required");
      return;
    }

    setInventoryLoading(true);
    try {
      await addInventoryItem({
        item_name: newInventoryItem.item_name,
        item_description: newInventoryItem.item_description,
        unit_of_measure: newInventoryItem.unit_of_measure,
        current_quantity: parseFloat(newInventoryItem.quantity) || 0,
        minimum_quantity: 0,
      });
      const inventoryData = await getAllInventoryItems();
      setInventoryItems(inventoryData);
      setNewInventoryItem({
        item_name: "",
        item_description: "",
        unit_of_measure: "pieces",
        quantity: 0,
      });
      setShowInventoryForm(false);
      setSnackbar({
        open: true,
        message: "Inventory item added successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error adding inventory item:", err);
      setError("Failed to add inventory item");
    } finally {
      setInventoryLoading(false);
    }
  };

  const handleAddOrUpdateService = async () => {
    setError("");
    if (
      !newServiceData.service_name ||
      !newServiceData.service_description ||
      newServiceData.service_price === ""
    ) {
      setError(
        "Please fill in all required fields (Name, Description, Price)."
      );
      return;
    }
    const price = parseFloat(newServiceData.service_price);
    if (isNaN(price)) {
      setError("Service price must be a valid number.");
      return;
    }

    try {
      const serviceData = {
        service_name: newServiceData.service_name,
        service_description: newServiceData.service_description,
        service_price: price,
      };

      if (editingServiceId) {
        await updateService(editingServiceId, serviceData);
        setSnackbar({
          open: true,
          message: "Service updated successfully!",
          severity: "success",
        });
      } else {
        await createService(serviceData);
        setSnackbar({
          open: true,
          message: "Service added successfully!",
          severity: "success",
        });
      }

      setNewServiceData({
        service_name: "",
        service_description: "",
        service_price: "",
      });
      setEditingServiceId(null);
      setShowServiceForm(false);
      fetchData();
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
      service_price: service.service_price.toString(),
    });
    setShowServiceForm(true);
    setError("");
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
        fetchData();
      } catch (err) {
        console.error(`Error deleting service with ID ${serviceId}:`, err);
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
    setShowServiceForm(false);
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

  if (error && services.length === 0 && !snackbar.open)
    return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Services We Provide
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage the list of services offered by your garage.
      </Typography>

      {/* Inventory Item Form - At the top */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          onClick={() => setShowInventoryForm(!showInventoryForm)}
          sx={{ mb: 2 }}
        >
          {showInventoryForm ? "Hide Inventory Form" : "Add New Inventory Item"}
        </Button>

        {showInventoryForm && (
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add New Inventory Item
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Item Name"
                  name="item_name"
                  value={newInventoryItem.item_name}
                  onChange={handleInventoryItemChange}
                  variant="outlined"
                  size="small"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Unit of Measure</InputLabel>
                  <Select
                    name="unit_of_measure"
                    value={newInventoryItem.unit_of_measure}
                    onChange={handleInventoryItemChange}
                    label="Unit of Measure"
                  >
                    <MenuItem value="pieces">Pieces</MenuItem>
                    <MenuItem value="liters">Liters</MenuItem>
                    <MenuItem value="kg">Kilograms</MenuItem>
                    <MenuItem value="meters">Meters</MenuItem>
                    <MenuItem value="boxes">Boxes</MenuItem>
                    <MenuItem value="units">Units</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="item_description"
                  value={newInventoryItem.item_description}
                  onChange={handleInventoryItemChange}
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Initial Quantity"
                  name="quantity"
                  type="number"
                  value={newInventoryItem.quantity}
                  onChange={handleInventoryItemChange}
                  variant="outlined"
                  size="small"
                  inputProps={{ step: "0.01", min: "0" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleAddNewInventoryItem}
                  disabled={inventoryLoading}
                  sx={{ mt: 1 }}
                >
                  {inventoryLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Add Inventory Item"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      {/* Services List */}
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
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <Typography variant="h6">{service.service_name}</Typography>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        display: "inline-block",
                        mr: 2,
                      }}
                    >
                      ETB {parseFloat(service.service_price ?? 0).toFixed(2)}
                    </Typography>
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(service);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteService(service.service_id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography paragraph>{service.service_description}</Typography>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>

      {/* Service Form - Hidden until clicked */}
      <Button
        variant="contained"
        onClick={() => {
          setEditingServiceId(null);
          setNewServiceData({
            service_name: "",
            service_description: "",
            service_price: "",
          });
          setShowServiceForm(true);
        }}
        sx={{ mb: 2 }}
      >
        Add New Service
      </Button>

      {showServiceForm && (
        <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {editingServiceId ? "Edit Service" : "Add New Service"}
          </Typography>
          {error && !snackbar.open && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
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
                required
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
                required
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
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setShowServiceForm(false);
                    handleCancelEdit();
                  }}
                >
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleAddOrUpdateService}>
                  {editingServiceId ? "Update Service" : "Add Service"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

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
