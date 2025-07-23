// components/Admin/VehicleList.jsx
import React from "react";

const VehicleList = ({ vehicles }) => {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="p-4 text-gray-600">
        No vehicles found for this customer. Add one using the form above.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Customer Vehicles</h3>
      {vehicles.map((vehicle) => (
        <div
          key={vehicle.vehicle_id}
          className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-bold text-gray-800">
              {vehicle.vehicle_year} {vehicle.vehicle_make}{" "}
              {vehicle.vehicle_model}
            </h4>
            {/* You can add an "Edit" button here later if needed */}
            {/* <button className="text-blue-600 hover:underline text-sm">Edit</button> */}
          </div>
          <p className="text-gray-700">
            <span className="font-medium">Type:</span>{" "}
            {vehicle.vehicle_type || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Mileage:</span>{" "}
            {vehicle.vehicle_mileage
              ? `${vehicle.vehicle_mileage} miles`
              : "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">License Tag:</span>{" "}
            {vehicle.vehicle_tag || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Serial Number:</span>{" "}
            {vehicle.vehicle_serial_number || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Color:</span>{" "}
            {vehicle.vehicle_color || "N/A"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default VehicleList;
