
import React, { useState } from "react";
import customerService from "../../../services/costemer.service";
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
import CustomerForm from "../../components/Admin/AddCustemerForm/AddCustomerPage"

function AddCustemer() {


    const AddCustomerForm = () => {
      const [formData, setFormData] = useState({
        customer_email: "",
        customer_first_name: "",
        customer_last_name: "",
        customer_phone_number: "",
      });

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await customerService.createCustomer(formData);
          alert("Customer created successfully!");
          // Reset form or redirect
        } catch (error) {
          alert(`Error: ${error.message}`);
        }
      };

      // ... rest of form implementation
    };
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <CustomerForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCustemer