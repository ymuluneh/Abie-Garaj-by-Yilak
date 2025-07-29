import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getCustomers,
  getCustomerVehicles,
  createOrder,
  getServices,
  getAllInventoryItems,
} from "../../../services/api";
import styles from "./CreateOrder.module.css";

const decodeTokenPayload = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
};

const CreateOrder = () => {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [additionalRequests, setAdditionalRequests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [servicesLoading, setServicesLoading] = useState(true);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [serviceQuantities, setServiceQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const customersRes = await getCustomers(1, 100, searchTerm);
        setCustomers(customersRes.data.customers);

        setServicesLoading(true);
        const [servicesData, inventoryData] = await Promise.all([
          getServices(),
          getAllInventoryItems(),
        ]);
        setServices(servicesData);
        setInventoryItems(inventoryData);
      } catch (error) {
        console.error("Initialization error:", error);
        setError(
          "Failed to load initial data. Please check network and backend."
        );
      } finally {
        setLoading(false);
        setServicesLoading(false);
      }
    };
    fetchData();
  }, [searchTerm]);

  useEffect(() => {
    if (selectedCustomer) {
      const fetchVehicles = async () => {
        setLoading(true);
        try {
          const response = await getCustomerVehicles(selectedCustomer);
          setVehicles(response.data.vehicles || []);
        } catch (error) {
          console.error("Error fetching vehicles:", error);
          setError("Failed to load customer vehicles");
          setVehicles([]);
        } finally {
          setLoading(false);
        }
      };
      fetchVehicles();
    } else {
      setVehicles([]);
      setSelectedVehicle(null);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    const fetchCurrentEmployee = async () => {
      try {
        const employee = JSON.parse(localStorage.getItem("employee"));
        if (employee && employee.employee_token) {
          const decoded = decodeTokenPayload(employee.employee_token);
          setCurrentEmployee(decoded);
        }
      } catch (error) {
        console.error("Failed to fetch employee data:", error);
      }
    };
    fetchCurrentEmployee();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );

    if (!serviceQuantities[serviceId]) {
      setServiceQuantities((prev) => ({
        ...prev,
        [serviceId]: {},
      }));
    }
  };

  const handleQuantityChange = (serviceId, itemId, value) => {
    setServiceQuantities((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [itemId]: parseFloat(value) || 0,
      },
    }));
  };

  const calculateTotal = () => {
    let serviceTotal = services.reduce((total, service) => {
      if (selectedServices.includes(service.service_id)) {
        return total + parseFloat(service?.service_price || 0);
      }
      return total;
    }, 0);

    let materialsTotal = selectedServices.reduce((total, serviceId) => {
      const quantities = serviceQuantities[serviceId] || {};
      return (
        total +
        Object.entries(quantities).reduce((sum, [itemId, quantity]) => {
          const item = inventoryItems.find((i) => i.item_id == itemId);
          return sum + (item ? parseFloat(item.item_price || 0) * quantity : 0);
        }, 0)
      );
    }, 0);

    return (serviceTotal + materialsTotal).toFixed(2);
  };

  const handleSubmit = async () => {
    if (!selectedCustomer || !selectedVehicle) {
      setError("Please select a customer and a vehicle.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        customer_id: selectedCustomer,
        employee_id: currentEmployee?.employee_id || 1,
        vehicle_id: selectedVehicle,
        services: selectedServices.map((service_id) => ({
          service_id,
          inventory_usage: Object.entries(serviceQuantities[service_id] || {})
            .filter(([_, quantity]) => quantity > 0)
            .map(([item_id, quantity]) => ({ item_id, quantity })),
        })),
        additional_requests: additionalRequests,
      };

      const response = await createOrder(orderData);

      const orderId =
        response?.data?.data?.orderId ||
        response?.data?.orderId ||
        response?.data ||
        response?.orderId ||
        response;

      if (!orderId) {
        throw new Error("No order ID received from server.");
      }

      toast.success(`Order #${orderId} created successfully!`);
      navigate(`/admin/orders/${orderId}`);
    } catch (error) {
      console.error("Order creation error:", error);
      setError(
        error.response?.data?.error ||
          error.message ||
          "Failed to create order. Please try again."
      );
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <h2>Search for a customer</h2>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search by name, email, or phone"
                value={searchTerm}
                onChange={handleSearch}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.customerGrid}>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <div
                    key={customer.customer_id}
                    className={`${styles.customerCard} ${
                      selectedCustomer === customer.customer_id
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => setSelectedCustomer(customer.customer_id)}
                  >
                    <h3>
                      {customer.customer_first_name}{" "}
                      {customer.customer_last_name}
                    </h3>
                    <p>
                      <strong>Email:</strong> {customer.customer_email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {customer.customer_phone_number}
                    </p>
                    <span
                      className={`${styles.statusBadge} ${
                        customer.customer_active_status
                          ? styles.active
                          : styles.inactive
                      }`}
                    >
                      {customer.customer_active_status ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>
                  No customers found. Try a different search.
                </div>
              )}
            </div>

            <button
              className={styles.addCustomerButton}
              onClick={() => navigate("/admin/add-customer")}
            >
              ADD NEW CUSTOMER
            </button>
          </div>
        );

      case 2:
        return (
          <div className={styles.stepContent}>
            <h2>Choose a vehicle</h2>
            {vehicles.length > 0 ? (
              <div className={styles.tableContainer}>
                <table className={styles.vehicleTable}>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Make</th>
                      <th>Model</th>
                      <th>Tag</th>
                      <th>Color</th>
                      <th>Mileage</th>
                      <th>Choose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr
                        key={vehicle.vehicle_id}
                        className={
                          selectedVehicle === vehicle.vehicle_id
                            ? styles.selectedRow
                            : ""
                        }
                      >
                        <td>{vehicle.vehicle_year}</td>
                        <td>{vehicle.vehicle_make}</td>
                        <td>{vehicle.vehicle_model}</td>
                        <td>{vehicle.vehicle_tag}</td>
                        <td>{vehicle.vehicle_color}</td>
                        <td>{vehicle.vehicle_mileage.toLocaleString()}</td>
                        <td>
                          <button
                            onClick={() =>
                              setSelectedVehicle(vehicle.vehicle_id)
                            }
                            className={styles.chooseButton}
                          >
                            {selectedVehicle === vehicle.vehicle_id ? (
                              <span className={styles.selectedIcon}>✓</span>
                            ) : (
                              "Select"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.noVehicles}>
                <p>No vehicles found for this customer.</p>
                <button
                  className={styles.addVehicleButton}
                  onClick={() => navigate(`/admin/add-vehicle`)}
                >
                  ADD NEW VEHICLE
                </button>
              </div>
            )}
          </div>
        );

      case 3:
        if (servicesLoading) {
          return (
            <div className={styles.stepContent}>
              <h2>Select Services</h2>
              <div className={styles.loadingContainer}>
                Loading services and inventory...
              </div>
            </div>
          );
        }

        return (
          <div className={styles.stepContent}>
            <h2>Select Services</h2>
            <div className={styles.servicesGrid}>
              {services.map((service) => (
                <div
                  key={service.service_id}
                  className={`${styles.serviceCard} ${
                    selectedServices.includes(service.service_id)
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() => handleServiceToggle(service.service_id)}
                >
                  <div className={styles.serviceHeader}>
                    <h3>{service.service_name}</h3>
                    <span className={styles.servicePrice}>
                      ${parseFloat(service.service_price ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <p className={styles.serviceDescription}>
                    {service.service_description}
                  </p>

                  {selectedServices.includes(service.service_id) && (
                    <>
                      {inventoryItems.length > 0 && (
                        <div className={styles.inventorySelection}>
                          <h4>Materials Used:</h4>
                          {inventoryItems.map((item) => (
                            <div
                              key={item.item_id}
                              className={styles.inventoryItem}
                            >
                              <label>
                                {item.item_name} ({item.unit_of_measure}):
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={
                                    serviceQuantities[service.service_id]?.[
                                      item.item_id
                                    ] || 0
                                  }
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      service.service_id,
                                      item.item_id,
                                      e.target.value
                                    )
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </label>
                              <span className={styles.currentStock}>
                                (Available: {item.current_quantity}) @ $
                                {parseFloat(item.item_price || 0).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className={styles.selectedOverlay}>Selected</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        const customer = customers.find(
          (c) => c.customer_id === selectedCustomer
        );
        const vehicle = vehicles.find((v) => v.vehicle_id === selectedVehicle);

        return (
          <div className={styles.stepContent}>
            <h2>Review Order Details</h2>

            <div className={styles.reviewSection}>
              <h3>Customer Information</h3>
              <div className={styles.infoCard}>
                <p>
                  <strong>Name:</strong> {customer?.customer_first_name}{" "}
                  {customer?.customer_last_name}
                </p>
                <p>
                  <strong>Email:</strong> {customer?.customer_email}
                </p>
                <p>
                  <strong>Phone:</strong> {customer?.customer_phone_number}
                </p>
              </div>
            </div>

            <div className={styles.reviewSection}>
              <h3>Vehicle Information</h3>
              <div className={styles.infoCard}>
                <p>
                  <strong>Vehicle:</strong> {vehicle?.vehicle_year}{" "}
                  {vehicle?.vehicle_make} {vehicle?.vehicle_model}
                </p>
                <p>
                  <strong>License Plate:</strong> {vehicle?.vehicle_tag}
                </p>
                <p>
                  <strong>Color:</strong> {vehicle?.vehicle_color}
                </p>
                <p>
                  <strong>Mileage:</strong>{" "}
                  {vehicle?.vehicle_mileage?.toLocaleString() || "N/A"} miles
                </p>
              </div>
            </div>

            <div className={styles.reviewSection}>
              <h3>Selected Services (Total: ${calculateTotal()})</h3>
              <div className={styles.servicesList}>
                {selectedServices.length > 0 ? (
                  selectedServices.map((serviceId) => {
                    const service = services.find(
                      (s) => s.service_id === serviceId
                    );
                    const quantities = serviceQuantities[serviceId] || {};
                    const materialsCost = Object.entries(quantities)
                      .filter(([_, qty]) => qty > 0)
                      .reduce((sum, [itemId, qty]) => {
                        const item = inventoryItems.find(
                          (i) => i.item_id == itemId
                        );
                        return (
                          sum +
                          (item ? parseFloat(item.item_price || 0) * qty : 0)
                        );
                      }, 0);

                    return service ? (
                      <div key={serviceId} className={styles.selectedService}>
                        <div>
                          <span>{service.service_name}</span>
                          <span>
                            $
                            {(
                              parseFloat(service.service_price || 0) +
                              materialsCost
                            ).toFixed(2)}
                            {materialsCost > 0 && (
                              <span className={styles.priceBreakdown}>
                                (Service: ${service.service_price}, Materials: $
                                {materialsCost.toFixed(2)})
                              </span>
                            )}
                          </span>
                        </div>
                        {Object.keys(quantities).length > 0 && (
                          <div className={styles.materialsUsed}>
                            <strong>Materials:</strong>
                            {Object.entries(quantities)
                              .filter(([_, qty]) => qty > 0)
                              .map(([itemId, qty]) => {
                                const item = inventoryItems.find(
                                  (i) => i.item_id == itemId
                                );
                                return item ? (
                                  <div key={itemId}>
                                    {item.item_name}: {qty}{" "}
                                    {item.unit_of_measure} @ $
                                    {parseFloat(item.item_price || 0).toFixed(
                                      2
                                    )}
                                  </div>
                                ) : null;
                              })}
                          </div>
                        )}
                      </div>
                    ) : null;
                  })
                ) : (
                  <div className={styles.selectedService}>
                    <span>No services selected.</span>
                    <span>$0.00</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.reviewSection}>
              <h3>Additional Requests</h3>
              <textarea
                className={styles.additionalRequests}
                value={additionalRequests}
                onChange={(e) => setAdditionalRequests(e.target.value)}
                placeholder="Enter any special instructions..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return !selectedCustomer;
      case 2:
        return !selectedVehicle;
      case 3:
        return servicesLoading;
      default:
        return false;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Create New Order</h1>
        <div className={styles.stepIndicator}>
          {[1, 2, 3, 4].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`${styles.step} ${
                step >= stepNumber ? styles.active : ""
              }`}
            >
              <div className={styles.stepNumber}>{stepNumber}</div>
              <div className={styles.stepLabel}>
                {stepNumber === 1 && "Customer"}
                {stepNumber === 2 && "Vehicle"}
                {stepNumber === 3 && "Services"}
                {stepNumber === 4 && "Review"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <span>{error}</span>
          <button onClick={() => setError("")}>&times;</button>
        </div>
      )}

      <div className={styles.mainContent}>{renderStepContent()}</div>

      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <p>
            <strong>Email:</strong> contact@autorex.com
          </p>
          <p>
            <strong>Phone:</strong> +1800 456 7890
          </p>
          <p>
            <strong>Address:</strong> 546. Talked! Town 5238 MT, La city, IA
            522364
          </p>
        </div>

        <div className={styles.footerRight}>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className={styles.navButton}
              disabled={loading}
            >
              Back
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className={`${styles.navButton} ${styles.primary}`}
              disabled={isNextDisabled() || loading}
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className={`${styles.navButton} ${styles.submitButton}`}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.spinner}></span>
              ) : (
                "SUBMIT ORDER"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
