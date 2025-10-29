import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VehicleForm from "../../components/Admin/VehicleForm";
import { getCustomerById, getCustomerVehicles } from "../../../services/api";

const CustomerProfilePage = () => {
  const { id } = useParams();
  const customerId = Number(id);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customerRes, vehiclesRes] = await Promise.all([
          getCustomerById(customerId),
          getCustomerVehicles(customerId),
        ]);

        setCustomer(customerRes.data);
        setVehicles(vehiclesRes.data.vehicles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

  const handleVehicleAdded = (newVehicle) => {
    setVehicles([...vehicles, newVehicle]);
    setShowVehicleForm(false);
  };

  if (loading) return <div className="p-4">Loading customer data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!customer) return <div className="p-4">Customer not found</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Customer Info Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
        <div className="space-y-2">
          <h3 className="font-medium">
            {customer.customer_first_name} {customer.customer_last_name}
          </h3>
          <div className="pl-4 border-l-2 border-gray-200">
            <p>Email: {customer.customer_email}</p>
            <p>Phone: {customer.customer_phone_number}</p>
            <p>
              Status: {customer.customer_active_status ? "Active" : "Inactive"}
            </p>
            <p>
              Member Since:{" "}
              {new Date(customer.customer_added_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Vehicles Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Vehicles ({vehicles.length})
          </h2>
          <button
            onClick={() => setShowVehicleForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Vehicle
          </button>
        </div>
        {showVehicleForm && (
          <div className="mt-6">
            <VehicleForm
              customerId={customerId}
              onVehicleAdded={handleVehicleAdded}
              onCancel={() => setShowVehicleForm(false)}
            />
          </div>
        )}

        {vehicles.length > 0 ? (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.vehicle_id} className="border p-4 rounded">
                <h3 className="font-medium">
                  {vehicle.vehicle_year} {vehicle.vehicle_make}{" "}
                  {vehicle.vehicle_model}
                </h3>
                <p>VIN: {vehicle.vehicle_serial_number || "N/A"}</p>
                <p>License: {vehicle.vehicle_tag || "N/A"}</p>
                <p>Mileage: {vehicle.vehicle_mileage || "N/A"}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No vehicles found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfilePage;
