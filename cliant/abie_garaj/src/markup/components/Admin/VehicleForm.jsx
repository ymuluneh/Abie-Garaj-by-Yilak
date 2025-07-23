import React, { useState, useEffect } from "react";
import { addVehicle } from "../../../services/api";

const VehicleForm = ({ customerId: passedCustomerId }) => {
  const [vehicleData, setVehicleData] = useState({
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_type: "hylox",
  });

  const [customerId, setCustomerId] = useState(passedCustomerId || "");

  useEffect(() => {
    if (passedCustomerId) {
      setCustomerId(passedCustomerId);
    }
  }, [passedCustomerId]);

  const handleChange = (e) => {
    setVehicleData({
      ...vehicleData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCustomerIdChange = (e) => {
    setCustomerId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = Number(customerId);
    if (!id || isNaN(id)) {
      console.error("[VehicleForm] Invalid customer ID:", customerId);
      alert("Customer ID is missing or invalid. Cannot add vehicle.");
      return;
    }

    const payload = {
      customer_id: id,
      ...vehicleData,
    };

    console.log("[VehicleForm] Submitting vehicle payload:", payload);

    try {
      await addVehicle(payload);
      alert("✅ Vehicle added successfully!");
    } catch (error) {
      console.error("[VehicleForm] Error adding vehicle:", error);
      alert("❌ Failed to add vehicle.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Vehicle</h3>

      {/* Input only shown if customerId not passed as prop */}
      {!passedCustomerId && (
        <div>
          <label>Customer ID:</label>
          <input
            type="number"
            name="customerId"
            value={customerId}
            onChange={handleCustomerIdChange}
            required
          />
        </div>
      )}

      <div>
        <label>Make:</label>
        <input
          type="text"
          name="vehicle_make"
          value={vehicleData.vehicle_make}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Model:</label>
        <input
          type="text"
          name="vehicle_model"
          value={vehicleData.vehicle_model}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Year:</label>
        <input
          type="text"
          name="vehicle_year"
          value={vehicleData.vehicle_year}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Type:</label>
        <input
          type="text"
          name="vehicle_type"
          value={vehicleData.vehicle_type}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Add Vehicle</button>
    </form>
  );
};

export default VehicleForm;
