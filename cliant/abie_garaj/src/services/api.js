import axios from "axios";

// For customer management API
const CUSTOMER_API_BASE_URL = "http://localhost:3000/api/customer";

// For vehicle-related API
const VEHICLE_API_BASE_URL = "http://localhost:3000/api/vehicle";

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

// Vehicle Management APIs
export const addVehicle = (vehicleData) => {
  return axios.post(VEHICLE_API_BASE_URL, vehicleData);
};

export const getVehiclesByCustomer = (customerId) => {
  return axios.get(`${VEHICLE_API_BASE_URL}/customer/${customerId}`);
};

export const getVehicleById = (vehicleId) => {
  return axios.get(`${VEHICLE_API_BASE_URL}/${vehicleId}`);
};

export const updateVehicle = (vehicleId, vehicleData) => {
  return axios.put(`${VEHICLE_API_BASE_URL}/${vehicleId}`, vehicleData);
};

export const getAllCustomers = () => {
  return axios.get("http://localhost:3000/api/customer", {
    params: { page: 1, limit: 1000 },
  });
};
