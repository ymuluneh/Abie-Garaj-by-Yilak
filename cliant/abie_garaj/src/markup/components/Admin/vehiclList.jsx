// src/components/VehicleManagementView/VehicleManagementView.jsx
// This code should be fine as it is, assuming backend sends the data
import React, { useState, useEffect, useCallback } from "react";
import { CircularProgress, Alert, Box, Divider } from "@mui/material";
import { getAllVehicles as fetchAllVehiclesApi } from "../../../services/api";
import PropTypes from "prop-types";

const VehicleList = ({ isAdmin = false }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllVehiclesApi(searchTerm);
      setVehicles(data);
    } catch (err) {
      setError("Failed to load vehicles.");
      console.error("Error loading vehicles:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchVehicles();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [fetchVehicles]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <CircularProgress />
        <p>Loading vehicles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "20px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
        Vehicle Management
      </h1>

      <Box
        sx={{
          p: 3,
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#0056b3", marginBottom: "20px" }}>All Vehicles</h2>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search vehicles by make, model, tag, serial, or customer info..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.075)",
              fontSize: "1rem",
            }}
          />
        </div>

        {vehicles.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            No vehicles found matching your search criteria.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.vehicle_id}
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid #eee",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: "1.1rem", color: "#333" }}>
                    {vehicle.vehicle_year} {vehicle.vehicle_make}{" "}
                    {vehicle.vehicle_model}
                  </h4>
                </div>
                <p
                  style={{
                    margin: "5px 0",
                    color: "#555",
                    fontSize: "0.95rem",
                  }}
                >
                  <strong style={{ color: "#333" }}>Type:</strong>{" "}
                  {vehicle.vehicle_type || "N/A"}
                </p>
                <p
                  style={{
                    margin: "5px 0",
                    color: "#555",
                    fontSize: "0.95rem",
                  }}
                >
                  <strong style={{ color: "#333" }}>Mileage:</strong>{" "}
                  {vehicle.vehicle_mileage
                    ? `${vehicle.vehicle_mileage} miles`
                    : "N/A"}
                </p>
                <p
                  style={{
                    margin: "5px 0",
                    color: "#555",
                    fontSize: "0.95rem",
                  }}
                >
                  <strong style={{ color: "#333" }}>License Tag:</strong>{" "}
                  {vehicle.vehicle_tag || "N/A"}
                </p>
                <p
                  style={{
                    margin: "5px 0",
                    color: "#555",
                    fontSize: "0.95rem",
                  }}
                >
                  <strong style={{ color: "#333" }}>Serial Number:</strong>{" "}
                  {vehicle.vehicle_serial_number || "N/A"}
                </p>
                <p
                  style={{
                    margin: "5px 0",
                    color: "#555",
                    fontSize: "0.95rem",
                  }}
                >
                  <strong style={{ color: "#333" }}>Color:</strong>{" "}
                  {vehicle.vehicle_color || "N/A"}
                </p>

                <Divider sx={{ my: 1.5, borderColor: "#e0e0e0" }} />

                <h5
                  style={{
                    margin: "10px 0 5px",
                    fontSize: "1rem",
                    color: "#444",
                  }}
                >
                  Customer Info:
                </h5>
                <p
                  style={{
                    margin: "5px 0",
                    color: "#555",
                    fontSize: "0.95rem",
                  }}
                >
                  <strong style={{ color: "#333" }}>Name:</strong>{" "}
                  {vehicle.customer_first_name || "N/A"}{" "}
                  {vehicle.customer_last_name || ""}
                </p>
                <p
                  style={{
                    margin: "5px 0",
                    color: "#555",
                    fontSize: "0.95rem",
                  }}
                >
                  <strong style={{ color: "#333" }}>Email:</strong>{" "}
                  {vehicle.customer_email || "N/A"}
                </p>
                <p
                  style={{
                    margin: "5px 0",
                    color: "#555",
                    fontSize: "0.95rem",
                  }}
                >
                  <strong style={{ color: "#333" }}>Phone:</strong>{" "}
                  {vehicle.customer_phone_number || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </Box>
    </div>
  );
};

VehicleList.propTypes = {
  isAdmin: PropTypes.bool,
  vehicles: PropTypes.arrayOf(
    PropTypes.shape({
      vehicle_id: PropTypes.number.isRequired,
      vehicle_year: PropTypes.number,
      vehicle_make: PropTypes.string,
      vehicle_model: PropTypes.string,
      vehicle_type: PropTypes.string,
      vehicle_mileage: PropTypes.number,
      vehicle_tag: PropTypes.string,
      vehicle_serial_number: PropTypes.string,
      vehicle_color: PropTypes.string,
      customer_first_name: PropTypes.string,
      customer_last_name: PropTypes.string,
      customer_email: PropTypes.string,
      customer_phone_number: PropTypes.string,
    })
  ),
};

VehicleList.defaultProps = {
  isAdmin: false,
  vehicles: [],
};

export default VehicleList;
