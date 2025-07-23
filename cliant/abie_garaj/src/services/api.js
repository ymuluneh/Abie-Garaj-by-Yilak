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

// For vehicle-related API (add this with your other exports)
export const getCustomerVehicles = (customerId) => {
  return axios.get(`${VEHICLE_API_BASE_URL}/customer/${customerId}`);
};

// export const getCustomerVehicles = async (customerId) => {
//   try {
//     const response = await axios.get(`/api/vehicle/customer/${customerId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching customer vehicles:", error);
//     throw error;
//   }
// };


// Order API
export const getOrders = async (page = 1, limit = 10, status = "") => {
  try {
    const response = await axios.get("http://localhost:3000/api/order", {
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
  return axios.get(`http://localhost:3000/api/order/${id}`);
};

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/order",
      orderData
    );
    return response.data; // Returns { success, data: { orderId } }
  } catch (error) {
    throw error;
  }
};

export const updateOrder = (id, orderData) => {
  return axios.put(`http://localhost:3000/api/order/${id}`, orderData);
};

export const updateOrderStatus = (id, status) => {
  return axios.put(`http://localhost:3000/api/order/${id}/status`, { status });
};

// Service API

export const getServices = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/services");
    return response.data; // Return the array directly
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};