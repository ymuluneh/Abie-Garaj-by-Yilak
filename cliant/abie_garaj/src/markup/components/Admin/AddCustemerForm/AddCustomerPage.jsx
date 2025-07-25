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

  setErrorMessage(""); // Clear previous errors
  setSuccessMessage(""); // Clear previous success messages

  // 1. ADDED: Frontend Email Validation (important for immediate user feedback)
  if (!formData.email.trim()) {
    setErrorMessage("Customer email is required.");
    return; // Stop the submission if email is empty
  }

  if (!isValidPhone(formData.phone)) {
    setErrorMessage("Please enter a valid phone number (555-555-5555)");
    return; // Stop the submission if phone is invalid
  }

  setIsSubmitting(true);

  try {
    const response = await addCustomer(formData);

    // 2. FIXED: Correctly check for backend success response
    // Your backend returns { customerId, message: "Customer created successfully." }
    // It does NOT return { success: true }.
    // So, we check for the presence of customerId in the response data.
    if (response.data && response.data.customerId) {
      setSuccessMessage(
        response.data.message || "Customer added successfully!"
      ); // Use backend message or a default
      setFormData({
        // Reset the form fields on successful submission
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
      });
    } else {
      // This 'else' block will only trigger if the API call was technically successful (no 'catch' error)
      // but the response data did not contain a 'customerId' as expected for success.
      setErrorMessage(
        response.data.message || "Failed to add customer (unexpected response)."
      );
    }
  } catch (error) {
    // This 'catch' block handles actual API errors (e.g., network issues, 4xx/5xx status codes from backend)
    const errorMsg =
      error.response?.data?.error || // Try to get specific 'error' from backend
      error.response?.data?.message || // Try to get specific 'message' from backend
      "Failed to add customer. Please try again."; // Fallback generic message
    setErrorMessage(errorMsg);
  } finally {
    setIsSubmitting(false); // Always reset submission status
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
