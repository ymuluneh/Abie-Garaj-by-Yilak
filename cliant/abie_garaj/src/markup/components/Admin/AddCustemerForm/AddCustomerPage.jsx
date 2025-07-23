import React, { useState } from "react";
import { addCustomer } from "../../../../services/api";
import styles from "./AddCustomer.module.css";

const AddCustomerPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneInput = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 10);

    // Format as 555-555-5555
    if (value.length > 3 && value.length <= 6) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 6) {
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
    }

    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const isValidPhone = (phone) => {
    return /^\d{3}-\d{3}-\d{4}$/.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidPhone(formData.phone)) {
      setErrorMessage("Please enter a valid phone number (555-555-5555)");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await addCustomer(formData);

      if (response.data.success) {
        setSuccessMessage("Customer added successfully!");
        setFormData({
          email: "",
          firstName: "",
          lastName: "",
          phone: "",
        });
      } else {
        setErrorMessage(response.data.error || "Failed to add customer");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to add customer. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add a new customer</h2>

      {successMessage && (
        <div className={`${styles.message} ${styles.success}`}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className={`${styles.message} ${styles.error}`}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>* Customer email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>* Customer first name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>* Customer last name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            * Customer phone (555-555-5555)
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handlePhoneInput}
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            placeholder="555-555-5555"
            className={styles.input}
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {isSubmitting ? "Adding Customer..." : "Add Customer"}
        </button>
      </form>
    </div>
  );
};

export default AddCustomerPage;
