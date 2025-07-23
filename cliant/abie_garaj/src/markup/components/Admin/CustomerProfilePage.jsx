// CustomerProfilePage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import VehicleForm from "../../components/Admin/VehicleForm";

const CustomerProfilePage = () => {
  const { id } = useParams(); // ✅ Extract ID from route
  const customerId = Number(id); // ✅ Convert to number

  return (
    <div>
      <h2>Customer Profile Page (ID: {customerId})</h2>
      <VehicleForm customerId={customerId} />
    </div>
  );
};

export default CustomerProfilePage;
