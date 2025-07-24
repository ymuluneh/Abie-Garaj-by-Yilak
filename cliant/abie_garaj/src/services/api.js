import axios from "axios";

// For customer management API
const CUSTOMER_API_BASE_URL = "http://localhost:3000/api/customer";

// For vehicle-related API
const VEHICLE_API_BASE_URL = "http://localhost:3000/api/vehicle";

// For order-related API
const ORDER_API_BASE_URL = "http://localhost:3000/api/order"; // Added for clarity with order APIs

// For service-related API
const SERVICE_API_BASE_URL = "http://localhost:3000/api/services"; // Added for clarity with service APIs

// Customer Management APIs
export const addCustomer = (data) => {
  return axios.post(CUSTOMER_API_BASE_URL, {
    customer_email: data.email,
    customer_phone_number: data.phone,
    customer_first_name: data.firstName,
    customer_last_name: data.lastName,
  });
};

export const getCustomers = (page = 1, limit = 10, search = "") => {
  return axios.get(CUSTOMER_API_BASE_URL, {
    params: { page, limit, search },
  });
};

export const getCustomerById = (id) => {
  return axios.get(`${CUSTOMER_API_BASE_URL}/${id}`);
};

export const updateCustomer = (id, data) => {
  return axios.put(`${CUSTOMER_API_BASE_URL}/${id}`, data);
};

export const getAllCustomers = () => {
  return axios.get(CUSTOMER_API_BASE_URL, { // Use constant for base URL
    params: { page: 1, limit: 1000 },
  });
};

// Vehicle Management APIs
export const addVehicle = (vehicleData) => {
  return axios.post(VEHICLE_API_BASE_URL, vehicleData);
};

export const getVehiclesByCustomer = (customerId) => {
  return axios.get(`${VEHICLE_API_BASE_URL}/customer/${customerId}`);
};

// This is the one actually used in CustomerProfilePage.jsx, keeping it for consistency
export const getCustomerVehicles = (customerId) => {
  return axios.get(`${VEHICLE_API_BASE_URL}/customer/${customerId}`);
};


export const getVehicleById = (vehicleId) => {
  return axios.get(`${VEHICLE_API_BASE_URL}/${vehicleId}`);
};

export const updateVehicle = (vehicleId, vehicleData) => {
  return axios.put(`${VEHICLE_API_BASE_URL}/${vehicleId}`, vehicleData);
};


// Order API
export const getOrders = async (page = 1, limit = 10, status = "") => {
  try {
    const response = await axios.get(ORDER_API_BASE_URL, { // Use constant for base URL
      params: { page, limit, status },
    });

    return {
      data: response.data.data, // Array of orders
      total: parseInt(response.headers["x-total-count"]) || 0,
      totalPages: response.data.pagination?.totalPages || 1,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = (id) => {
  return axios.get(`${ORDER_API_BASE_URL}/${id}`); // Use constant for base URL
};

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(ORDER_API_BASE_URL, orderData); // Use constant for base URL
    return response.data; // Returns { success, data: { orderId } }
  } catch (error) {
    throw error;
  }
};

export const updateOrder = (id, orderData) => {
  return axios.put(`${ORDER_API_BASE_URL}/${id}`, orderData); // Use constant for base URL
};

export const updateOrderStatus = (id, status) => {
  return axios.put(`${ORDER_API_BASE_URL}/${id}/status`, { status }); // Use constant for base URL
};

// NEW: API to get orders by customer ID
export const getCustomerOrders = (customerId) => {
  return axios.get(`${ORDER_API_BASE_URL}/customer/${customerId}`); // Adjust this endpoint based on your backend
};

// Service API
export const getServices = async () => {
  try {
    const response = await axios.get(SERVICE_API_BASE_URL); // Use constant for base URL
    return response.data; // Return the array directly
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const createService = async (serviceData) => {
  try {
    const response = await axios.post(SERVICE_API_BASE_URL, serviceData); // Use constant for base URL
    return response.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
};

export const updateService = async (id, serviceData) => {
  try {
    const response = await axios.put(`${SERVICE_API_BASE_URL}/${id}`, serviceData); // Use constant for base URL
    return response.data;
  } catch (error) {
    console.error(`Error updating service with ID ${id}:`, error);
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    const response = await axios.delete(`${SERVICE_API_BASE_URL}/${id}`); // Use constant for base URL
    return response.data;
  } catch (error) {
    console.error(`Error deleting service with ID ${id}:`, error);
    throw error;
  }
};