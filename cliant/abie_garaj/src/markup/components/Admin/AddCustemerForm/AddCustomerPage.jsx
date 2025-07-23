import React, { useState } from "react";
import { addCustomer } from "../../../../services/api"; 

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

  // Validate phone number format
  const isValidPhone = (phone) => {
    return /^\d{3}-\d{3}-\d{4}$/.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone format
    if (!isValidPhone(formData.phone)) {
      setErrorMessage("Please enter a valid phone number (555-555-5555)");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await addCustomer(formData);
      
      // Handle successful response
      if (response.data.success) {
        setSuccessMessage("Customer added successfully!");
        // Reset form
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
      // Handle different error types
      const errorMsg = error.response?.data?.error || 
                      error.response?.data?.message || 
                      "Failed to add customer. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add a new customer
        </h2>

        {successMessage && (
          <div className="mb-6 p-3 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Customer email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Customer first name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Customer last name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Customer phone (555-555-5555)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneInput}
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder="555-555-5555"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {isSubmitting ? "Adding Customer..." : "ADD CUSTOMER"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerPage;