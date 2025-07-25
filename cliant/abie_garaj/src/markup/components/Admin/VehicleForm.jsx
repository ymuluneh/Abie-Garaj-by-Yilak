import React, { useState, useEffect } from "react";
import { addVehicle, getAllCustomers } from "../../../services/api";

const VehicleForm = ({ customerId: propCustomerId }) => {
  const [vehicle, setVehicle] = useState({
    customer_id: propCustomerId || "",
    vehicle_year: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_type: "",
    vehicle_mileage: "",
    vehicle_tag: "",
    vehicle_serial_number: "",
    vehicle_color: "",
  });

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    vehicle_mileage: "",
    vehicle_tag: "",
    vehicle_serial_number: "",
  });

  useEffect(() => {
    if (!propCustomerId) {
      fetchCustomers();
    }
  }, [propCustomerId]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCustomers(customers);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const results = customers.filter((customer) => {
      if (!customer) return false;

      const fullName = `${customer.customer_first_name || ""} ${
        customer.customer_last_name || ""
      }`.toLowerCase();
      const email = customer.customer_email?.toLowerCase() || "";
      const phone = customer.customer_phone_number?.toString() || "";

      return (
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchTerm) // Keep phone as string for exact match
      );
    });

    setFilteredCustomers(results);
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const response = await getAllCustomers();

      let customersData = [];
      if (Array.isArray(response)) {
        customersData = response;
      } else if (response?.data) {
        customersData = Array.isArray(response.data)
          ? response.data
          : response.data.customers || [];
      }

      setCustomers(customersData);
      setFilteredCustomers(customersData);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setMessage({
        text: "Failed to load customers. Please try again later.",
        type: "error",
      });
      setCustomers([]);
      setFilteredCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const validateMileage = (value) => {
    if (value === "") return true;
    const numValue = parseInt(value);
    if (isNaN(numValue)) return false;
    if (numValue < 0) return false;
    if (numValue > 1000000) return false;
    return true;
  };

  const handleMileageChange = (e) => {
    const { value } = e.target;

    if (value === "" || /^\d*$/.test(value)) {
      setVehicle((prev) => ({ ...prev, vehicle_mileage: value }));

      if (value !== "" && !validateMileage(value)) {
        setFieldErrors((prev) => ({
          ...prev,
          vehicle_mileage: "Please enter a valid mileage (0-1,000,000)",
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          vehicle_mileage: "",
        }));
      }
    }
  };

  const handleCustomerSelect = (customerId) => {
    setVehicle((prev) => ({ ...prev, customer_id: customerId }));
    setShowDropdown(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    setFieldErrors({
      vehicle_mileage: "",
      vehicle_tag: "",
      vehicle_serial_number: "",
    });

    if (!vehicle.customer_id) {
      setMessage({
        text: "Please select a valid customer.",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    if (
      !vehicle.vehicle_make ||
      !vehicle.vehicle_model ||
      !vehicle.vehicle_year
    ) {
      setMessage({
        text: "Please fill in all required fields (Make, Model, Year)",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    if (vehicle.vehicle_mileage && !validateMileage(vehicle.vehicle_mileage)) {
      setFieldErrors((prev) => ({
        ...prev,
        vehicle_mileage: "Please enter a valid mileage (0-1,000,000)",
      }));
      setIsLoading(false);
      return;
    }

    try {
      const vehicleData = {
        customer_id: vehicle.customer_id,
        vehicle_year: vehicle.vehicle_year,
        vehicle_make: vehicle.vehicle_make,
        vehicle_model: vehicle.vehicle_model,
        vehicle_type: vehicle.vehicle_type || null,
        vehicle_mileage: vehicle.vehicle_mileage
          ? parseInt(vehicle.vehicle_mileage)
          : null,
        vehicle_tag: vehicle.vehicle_tag || null,
        vehicle_serial_number: vehicle.vehicle_serial_number || null,
        vehicle_color: vehicle.vehicle_color || null,
      };

      const response = await addVehicle(vehicleData);

      setMessage({
        text: "Vehicle added successfully!",
        type: "success",
      });

      setVehicle({
        customer_id: propCustomerId || "",
        vehicle_year: "",
        vehicle_make: "",
        vehicle_model: "",
        vehicle_type: "",
        vehicle_mileage: "",
        vehicle_tag: "",
        vehicle_serial_number: "",
        vehicle_color: "",
      });
      setSearchTerm("");
    } catch (error) {
      console.error("Full error details:", error);

      let errorMessage = "Failed to add vehicle. Please try again.";
      let specificField = null;

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;

        if (errorMessage.includes("license plate")) {
          specificField = "vehicle_tag";
        } else if (errorMessage.includes("serial number")) {
          specificField = "vehicle_serial_number";
        } else if (errorMessage.includes("mileage")) {
          specificField = "vehicle_mileage";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (specificField) {
        setFieldErrors((prev) => ({
          ...prev,
          [specificField]: errorMessage,
        }));
      } else {
        setMessage({
          text: errorMessage,
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vehicle-form-container p-4 border rounded shadow-sm">
      <h2 className="mb-4">Add Vehicle</h2>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit}>
        {!propCustomerId && (
          <div className="mb-3 position-relative">
            <label htmlFor="customer_search" className="form-label">
              Select Customer
            </label>
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                id="customer_search"
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={isLoading}
                autoComplete="off"
              />
              {isLoading && (
                <span className="input-group-text">
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                </span>
              )}
            </div>

            {showDropdown && filteredCustomers.length > 0 && (
              <div
                className="list-group position-absolute w-100"
                style={{ zIndex: 1000 }}
              >
                {filteredCustomers.map((customer) => (
                  <button
                    type="button"
                    key={customer.customer_id}
                    className={`list-group-item list-group-item-action ${
                      vehicle.customer_id === customer.customer_id
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleCustomerSelect(customer.customer_id)}
                  >
                    <div className="d-flex justify-content-between">
                      <span>
                        {customer.customer_first_name}{" "}
                        {customer.customer_last_name}
                      </span>
                      <span className="text-muted">
                        {customer.customer_phone_number}
                      </span>
                    </div>
                    <div className="text-muted small">
                      {customer.customer_email}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showDropdown && searchTerm && filteredCustomers.length === 0 && (
              <div
                className="list-group position-absolute w-100"
                style={{ zIndex: 1000 }}
              >
                <div className="list-group-item">
                  No customers found matching "{searchTerm}"
                </div>
              </div>
            )}

            {vehicle.customer_id && (
              <div className="mt-2">
                <strong>Selected Customer:</strong>{" "}
                {
                  customers.find((c) => c.customer_id === vehicle.customer_id)
                    ?.customer_first_name
                }{" "}
                {
                  customers.find((c) => c.customer_id === vehicle.customer_id)
                    ?.customer_last_name
                }
              </div>
            )}
          </div>
        )}

        {/* Rest of the form fields remain the same */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="vehicle_make" className="form-label">
              Make *
            </label>
            <input
              type="text"
              className="form-control"
              id="vehicle_make"
              name="vehicle_make"
              value={vehicle.vehicle_make}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="vehicle_model" className="form-label">
              Model *
            </label>
            <input
              type="text"
              className="form-control"
              id="vehicle_model"
              name="vehicle_model"
              value={vehicle.vehicle_model}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="vehicle_year" className="form-label">
              Year *
            </label>
            <input
              type="number"
              className="form-control"
              id="vehicle_year"
              name="vehicle_year"
              value={vehicle.vehicle_year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear() + 1}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="vehicle_color" className="form-label">
              Color
            </label>
            <input
              type="text"
              className="form-control"
              id="vehicle_color"
              name="vehicle_color"
              value={vehicle.vehicle_color}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="vehicle_tag" className="form-label">
              License Plate
            </label>
            <input
              type="text"
              className={`form-control ${
                fieldErrors.vehicle_tag ? "is-invalid" : ""
              }`}
              id="vehicle_tag"
              name="vehicle_tag"
              value={vehicle.vehicle_tag}
              onChange={handleChange}
            />
            {fieldErrors.vehicle_tag && (
              <div className="invalid-feedback">{fieldErrors.vehicle_tag}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="vehicle_mileage" className="form-label">
              Mileage
            </label>
            <input
              type="text"
              className={`form-control ${
                fieldErrors.vehicle_mileage ? "is-invalid" : ""
              }`}
              id="vehicle_mileage"
              name="vehicle_mileage"
              value={vehicle.vehicle_mileage}
              onChange={handleMileageChange}
              pattern="\d*"
            />
            {fieldErrors.vehicle_mileage && (
              <div className="invalid-feedback">
                {fieldErrors.vehicle_mileage}
              </div>
            )}
            <small className="text-muted">
              Enter mileage in miles (0-1,000,000)
            </small>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="vehicle_serial_number" className="form-label">
              VIN/Serial Number
            </label>
            <input
              type="text"
              className={`form-control ${
                fieldErrors.vehicle_serial_number ? "is-invalid" : ""
              }`}
              id="vehicle_serial_number"
              name="vehicle_serial_number"
              value={vehicle.vehicle_serial_number}
              onChange={handleChange}
            />
            {fieldErrors.vehicle_serial_number && (
              <div className="invalid-feedback">
                {fieldErrors.vehicle_serial_number}
              </div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="vehicle_type" className="form-label">
              Type (e.g., Sedan, SUV)
            </label>
            <input
              type="text"
              className="form-control"
              id="vehicle_type"
              name="vehicle_type"
              value={vehicle.vehicle_type}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Adding...
            </>
          ) : (
            "Add Vehicle"
          )}
        </button>
      </form>
    </div>
  );
};

export default VehicleForm;
