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
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!propCustomerId) {
      fetchCustomers();
    }
  }, [propCustomerId]);

  const fetchCustomers = async () => {
    try {
      const response = await getAllCustomers();
      if (Array.isArray(response.data)) {
        setCustomers(response.data);
      } else if (response.data && Array.isArray(response.data.customers)) {
        setCustomers(response.data.customers);
      } else {
        console.error("[VehicleForm] Unexpected format:", response.data);
        setCustomers([]);
      }
    } catch (error) {
      console.error("[VehicleForm] Failed to fetch customers:", error);
      setCustomers([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prevVehicle) => ({
      ...prevVehicle,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicle.customer_id) {
      console.error("[VehicleForm] Error: Customer ID is missing or invalid.");
      setMessage("Please select a valid customer.");
      return;
    }

    try {
      // Map the form data to match backend expectations
      const vehicleData = {
        customer_id: vehicle.customer_id,
        vehicle_year: vehicle.vehicle_year,
        vehicle_make: vehicle.vehicle_make,
        vehicle_model: vehicle.vehicle_model,
        vehicle_type: vehicle.vehicle_type || null,
        vehicle_mileage: vehicle.vehicle_mileage || null,
        vehicle_tag: vehicle.vehicle_tag || null,
        vehicle_serial_number: vehicle.vehicle_serial_number || null,
        vehicle_color: vehicle.vehicle_color || null,
      };

      const response = await addVehicle(vehicleData);
      console.log("[VehicleForm] Vehicle added successfully:", response.data);

      setMessage("Vehicle added successfully!");
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
    } catch (error) {
      console.error("[VehicleForm] Error adding vehicle:", error);
      setMessage("Failed to add vehicle. Please try again.");
    }
  };

  return (
    <div className="vehicle-form-container p-4 border rounded shadow-sm">
      <h2 className="mb-4">Add Vehicle</h2>

      {message && <p className="alert alert-info">{message}</p>}

      <form onSubmit={handleSubmit}>
        {!propCustomerId && (
          <div className="mb-3">
            <label htmlFor="customer_id" className="form-label">
              Select Customer
            </label>
            <select
              name="customer_id"
              id="customer_id"
              className="form-select"
              value={vehicle.customer_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Select a customer --</option>
              {Array.isArray(customers) &&
                customers.map((customer) => (
                  <option
                    key={customer.customer_id}
                    value={customer.customer_id}
                  >
                    {customer.customer_first_name} {customer.customer_last_name}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="vehicle_make" className="form-label">
            Make
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

        <div className="mb-3">
          <label htmlFor="vehicle_model" className="form-label">
            Model
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

        <div className="mb-3">
          <label htmlFor="vehicle_year" className="form-label">
            Year
          </label>
          <input
            type="number"
            className="form-control"
            id="vehicle_year"
            name="vehicle_year"
            value={vehicle.vehicle_year}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
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

        <div className="mb-3">
          <label htmlFor="vehicle_tag" className="form-label">
            License Plate
          </label>
          <input
            type="text"
            className="form-control"
            id="vehicle_tag"
            name="vehicle_tag"
            value={vehicle.vehicle_tag}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="vehicle_mileage" className="form-label">
            Mileage
          </label>
          <input
            type="number"
            className="form-control"
            id="vehicle_mileage"
            name="vehicle_mileage"
            value={vehicle.vehicle_mileage}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="vehicle_serial_number" className="form-label">
            VIN/Serial Number
          </label>
          <input
            type="text"
            className="form-control"
            id="vehicle_serial_number"
            name="vehicle_serial_number"
            value={vehicle.vehicle_serial_number}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="vehicle_type" className="form-label">
            Type
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

        <button type="submit" className="btn btn-primary">
          Add Vehicle
        </button>
      </form>
    </div>
  );
};

export default VehicleForm;
