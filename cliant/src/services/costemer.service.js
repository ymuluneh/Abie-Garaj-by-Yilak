import axios from "axios";
import getAuth from "../Util/auth"; // Import your auth service

// Create Axios instance with base URL
const api = axios.create({
  baseURL: "https://abieback.yilakmuluneh.com/api/customer", // Update with your backend URL
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const authData = await getAuth();

    if (authData && authData.employee_token) {
      config.headers.Authorization = `Bearer ${authData.employee_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        console.error("Unauthorized - redirect to login");
        // Redirect logic would go here
      }
      // IMPORTANT: Reject with error.response.data to get the server's error message
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
  }
);

const customerService = {
  /**
   * Get all customers with pagination
   * @param {number} limit - Number of customers per page
   * @param {string} sortby - Field to sort by
   * @returns {Promise} - Customers list with pagination info
   */
  getAllCustomers: async (limit = 10, sortby = "customer_added_date") => {
    try {
      const response = await api.get("/", {
        params: { limit, sortby },
      });
      return response.data;
    } catch (error) {
      // Throw the raw error from the interceptor so components can access err.data.message
      throw error;
    }
  },

  /**
   * Get single customer by ID
   * @param {number} customerId - Customer ID
   * @returns {Promise} - Customer details
   */
  getCustomerById: async (customerId) => {
    try {
      const response = await api.get(`/${customerId}`);
      return response.data;
    } catch (error) {
      // Throw the raw error from the interceptor so components can access err.data.message
      throw error;
    }
  },

  /**
   * Create new customer
   * @param {object} customerData - Customer data
   * @returns {Promise} - Success status
   */
  createCustomer: async (customerData) => {
    try {
      // FIX: Changed endpoint from "baseURL" to "/"
      const response = await api.post("/", customerData);
      return response.data;
    } catch (error) {
      // Throw the raw error from the interceptor so components can access err.data.message
      throw error;
    }
  },

  /**
   * Update existing customer
   * @param {number} customerId - ID of the customer to update
   * @param {object} customerData - Updated customer data
   * @returns {Promise} - Success status
   */
  updateCustomer: async (customerId, customerData) => {
    try {
      // FIX: Changed PUT endpoint to include customerId
      const response = await api.put(`/${customerId}`, customerData);
      return response.data;
    } catch (error) {
      // Throw the raw error from the interceptor so components can access err.data.message
      throw error;
    }
  },

  /**
   * Search customers by name, email, or phone
   * @param {string} query - Search term
   * @returns {Promise} - Matching customers
   */
  searchCustomers: async (query) => {
    try {
      const response = await api.get("/search", { params: { q: query } });
      return response.data;
    } catch (error) {
      // Throw the raw error from the interceptor so components can access err.data.message
      throw error;
    }
  },
};


export default customerService;
