import axios from "axios";

// Base URLs
const CUSTOMER_API_BASE_URL = "http://localhost:3000/api/customer";
const VEHICLE_API_BASE_URL = "http://localhost:3000/api/vehicle";
const ORDER_API_BASE_URL = "http://localhost:3000/api/order";
const SERVICE_API_BASE_URL = "http://localhost:3000/api/services";
const EMPLOYEE_API_BASE_URL = "http://localhost:3000/api/employees";

// Helper function to get the authorization header
const getAuthHeader = () => {
  try {
    const employeeData = JSON.parse(localStorage.getItem("employee"));
    if (employeeData && employeeData.employee_token) {
      return {
        headers: {
          "x-access-token": employeeData.employee_token,
        },
      };
    }
  } catch (e) {
    console.error("Failed to parse employee data from localStorage:", e);
  }
  return {};
};

// Customer Management APIs
export const addCustomer = (data) => {
  return axios.post(CUSTOMER_API_BASE_URL, {
    customer_email: data.email,
    customer_phone_number: data.phone,
    customer_first_name: data.firstName,
    customer_last_name: data.lastName,
  });
};

export const getCustomers = async (page = 1, limit = 10, search = "") => {
  try {
    // console.log("services/api.js: Calling GET customers with params:", {
    //   page,
    //   limit,
    //   search,
    // });
    const response = await axios.get(CUSTOMER_API_BASE_URL, {
      params: { page, limit, search },
      ...getAuthHeader(),
    });
    // console.log(
    //   "services/api.js: Raw response.data for getCustomers:",
    //   response.data
    // );
    return response.data; // This should be { success: true, data: { customers: [...], total: X } }
  } catch (error) {
    console.error("Error fetching customers in api.js:", error);
    throw error;
  }
};

export const getAllCustomers = async () => {
  try {
    const response = await getCustomers(1, 99999);
    // The getCustomers function now returns { data: { customers: [...], total: X } }
    // So, we need to access response.data.customers
    return response.data.customers;
  } catch (error) {
    console.error("Error fetching all customers in api.js:", error);
    throw error;
  }
};

export const getCustomerById = (id) => {
  return axios.get(`${CUSTOMER_API_BASE_URL}/${id}`, getAuthHeader());
};

export const updateCustomer = (id, data) => {
  return axios.put(
    `${CUSTOMER_API_BASE_URL}/${id}`,
    {
      phone: data.customer_phone_number || data.phone,
      firstName: data.customer_first_name || data.firstName,
      lastName: data.customer_last_name || data.lastName,
      activeStatus:
        data.customer_active_status !== undefined
          ? data.customer_active_status
          : data.activeStatus
          ? 1
          : 0,
    },
    getAuthHeader()
  );
};

// Vehicle Management APIs
export const addVehicle = (vehicleData) => {
  return axios.post(VEHICLE_API_BASE_URL, vehicleData, getAuthHeader());
};

export const getVehiclesByCustomer = (customerId) => {
  return axios.get(
    `${VEHICLE_API_BASE_URL}/customer/${customerId}`,
    getAuthHeader()
  );
};

export const getCustomerVehicles = (customerId) => {
  return axios.get(
    `${VEHICLE_API_BASE_URL}/customer/${customerId}`,
    getAuthHeader()
  );
};

export const getVehicleById = (vehicleId) => {
  return axios.get(`${VEHICLE_API_BASE_URL}/${vehicleId}`, getAuthHeader());
};

export const updateVehicle = (vehicleId, vehicleData) => {
  return axios.put(
    `${VEHICLE_API_BASE_URL}/${vehicleId}`,
    vehicleData,
    getAuthHeader()
  );
};

// Order API
export const getOrders = async (
  page = 1,
  limit = 10,
  status = "",
  includeServices = false
) => {
  try {
    // console.log("api.js: Calling getOrders with params:", {
    //   page,
    //   limit,
    //   status,
    //   includeServices,
    // });
    const response = await axios.get(ORDER_API_BASE_URL, {
      params: { page, limit, status, includeServices },
      ...getAuthHeader(),
    });

    return {
      data: response.data.data, // This is already correctly structured from backend
      total: parseInt(response.headers["x-total-count"]) || 0,
      totalPages: response.data.pagination?.totalPages || 1,
    };
  } catch (error) {
    console.error("Error fetching orders in api.js:", error);
    throw error;
  }
};

export const getOrderById = (id) => {
  return axios.get(`${ORDER_API_BASE_URL}/${id}`, getAuthHeader());
};

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(
      ORDER_API_BASE_URL,
      orderData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateOrder = (id, orderData) => {
  return axios.put(`${ORDER_API_BASE_URL}/${id}`, orderData, getAuthHeader());
};

export const updateOrderStatus = (id, status) => {
  return axios.put(
    `${ORDER_API_BASE_URL}/${id}/status`,
    { status },
    getAuthHeader()
  );
};

export const sendOrderCompletionNotification = (orderId) => {
  return axios.post(
    `${ORDER_API_BASE_URL}/${orderId}/notify-completion`,
    {},
    getAuthHeader()
  );
};

export const getCustomerOrders = (customerId) => {
  return axios.get(
    `${ORDER_API_BASE_URL}/customer/${customerId}`,
    getAuthHeader()
  );
};

// Service API
export const getServices = async () => {
  try {
    const response = await axios.get(SERVICE_API_BASE_URL, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error fetching services in api.js:", error);
    throw error;
  }
};

export const createService = async (serviceData) => {
  try {
    const response = await axios.post(
      SERVICE_API_BASE_URL,
      serviceData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error creating service in api.js:", error);
    throw error;
  }
};

export const updateService = async (id, serviceData) => {
  try {
    const response = await axios.put(
      `${SERVICE_API_BASE_URL}/${id}`,
      serviceData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating service with ID ${id} in api.js:`, error);
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    const response = await axios.delete(
      `${SERVICE_API_BASE_URL}/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting service with ID ${id} in api.js:`, error);
    throw error;
  }
};

// Fetches all employees
export const getAllEmployees = async () => {
  const response = await axios.get(EMPLOYEE_API_BASE_URL, getAuthHeader());
  return response.data.data;
};

export const getAllOrdersForDashboard = async () => {
  const response = await getOrders(1, 99999, "", true);
  return response.data;
};

export const getAllVehicles = async () => {
  const response = await axios.get(
    `${VEHICLE_API_BASE_URL}/all`,
    getAuthHeader()
  );
  return response.data.data;
};
