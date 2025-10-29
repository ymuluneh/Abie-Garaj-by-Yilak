import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById, updateCustomer } from "../../../services/api";
import styles from "./EditCustomer.module.css";

const EditCustomerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    activeStatus: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await getCustomerById(id);
        const customer = response.data;

        setFormData({
          email: customer.customer_email || "",
          firstName: customer.customer_first_name || "",
          lastName: customer.customer_last_name || "",
          phone: customer.customer_phone_number || "",
          activeStatus: customer.customer_active_status === 1,
        });
      } catch (err) {
        console.error("Failed to load customer:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, activeStatus: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCustomer(id, {
        customer_first_name: formData.firstName,
        customer_last_name: formData.lastName,
        customer_phone_number: formData.phone,
        customer_active_status: formData.activeStatus ? 1 : 0,
      });
      navigate("/admin/customers");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Editione Admin</h1>

      <div className={styles.editForm}>
        <h3 className={styles.subtitle}>
          Edit: {formData.firstName} {formData.lastName}
        </h3>

        <div className={styles.emailDisplay}>
          <strong>Customer email:</strong> {formData.email}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={styles.inputField}
          />

          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={styles.inputField}
          />

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={styles.inputField}
          />

          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="activeStatus"
              checked={formData.activeStatus}
              onChange={handleCheckboxChange}
              className={styles.checkboxInput}
            />
            <label>Is active customer</label>
          </div>

          <button type="submit" className={styles.updateButton}>
            UPDATE
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCustomerPage;
