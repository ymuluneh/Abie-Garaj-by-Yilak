// services/vehicle.service.js
import axios from "axios";
import getAuth from "../Util/auth"; // Assuming this path is correct
const api_url = import.meta.env.VITE_API_URL;

// Create Axios instance for vehicle API calls
const vehicleApi = axios.create({
  baseURL: `${api_url}`/api/vehicle, // Ensure this matches your backend server and route prefix
  timeout: 10000,
});

// Request interceptor to add auth token
vehicleApi.interceptors.request.use(
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
vehicleApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Vehicle API Error Response:", error.response.data);
      if (error.response.status === 401) {
        console.error("Unauthorized - redirect to login or refresh token");
        // TODO: Implement actual redirect or token refresh logic
      }
      return Promise.reject(error.response.data); // Reject with the server's error message
    } else if (error.request) {
      // Request was made but no response received
      console.error("Vehicle API No Response:", error.request);
      return Promise.reject(
        "No response from server. Please check your network connection."
      );
    } else {
      // Something else happened in setting up the request
      console.error("Vehicle API Request Setup Error:", error.message);
      return Promise.reject(
        "Error setting up vehicle request: " + error.message
      );
    }
  }
);

const vehicleService = {
  /**
   * Get a single vehicle by ID
   * @param {number} vehicleId - Vehicle ID
   * @returns {Promise<object>} - Vehicle details
   */
  getVehicleById: async (vehicleId) => {
    try {
      const response = await vehicleApi.get(`/${vehicleId}`);
      return response.data;
    } catch (error) {
      throw error; // Re-throw to be caught by the component
    }
  },

  /**
   * Add a new vehicle
   * @param {object} vehicleData - Vehicle data (including customer_id)
   * @returns {Promise<object>} - Success status and new vehicle ID
   */
  addVehicle: async (vehicleData) => {
    try {
      const response = await vehicleApi.post("/", vehicleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing vehicle
   * @param {object} vehicleData - Updated vehicle data (must include vehicle_id)
   * @returns {Promise<object>} - Success status
   */
  updateVehicle: async (vehicleData) => {
    try {
      const response = await vehicleApi.put("/", vehicleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all vehicles for a specific customer
   * @param {number} customerId - Customer ID
   * @returns {Promise<object>} - Object containing customer_id and an array of vehicles
   */
  getVehiclesByCustomer: async (customerId) => {
    try {
      const response = await vehicleApi.get(`/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default vehicleService;

export const getAllCustomers = () => {
  return axios.get("/api/customers"); // Adjust path if needed
};

export const addVehicle = (data) => {
  return axios.post("/api/vehicle", data);
};
