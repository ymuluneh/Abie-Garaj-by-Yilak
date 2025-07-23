import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/customer";

// Add the missing export
export const addCustomer = (data) => {
  return axios.post(API_BASE_URL, {
    customer_email: data.email,
    customer_phone_number: data.phone,
    customer_first_name: data.firstName,
    customer_last_name: data.lastName,
  });
};

export const getCustomers = (page = 1, limit = 10, search = "") => {
  return axios.get(API_BASE_URL, {
    params: { page, limit, search },
  });
};

export const getCustomerById = (id) => {
  return axios.get(`${API_BASE_URL}/${id}`);
};

export const updateCustomer = (id, data) => {
  return axios.put(`${API_BASE_URL}/${id}`, data);
};

//vehicle

export const addVehicle = (data) => {
  return axios.post(`http://localhost:3000/api/vehicle`, data);
};

export const getCustomerVehicles = (customerId) => {
  return axios.get(`http://localhost:3000/api/vehicle/customer/${customerId}`);
};