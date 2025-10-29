import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Base URLs
const CUSTOMER_API_BASE_URL = `${API_BASE_URL}/api/customer`;
const VEHICLE_API_BASE_URL = `${API_BASE_URL}/api/vehicle`;
const ORDER_API_BASE_URL = `${API_BASE_URL}/api/order`;
const SERVICE_API_BASE_URL = `${API_BASE_URL}/api/services`;
const EMPLOYEE_API_BASE_URL = `${API_BASE_URL}/api/employees`;
const INVENTORY_API_BASE_URL = `${API_BASE_URL}/api/inventory`;

// Rest of your file remains the same...

// Base URLs
// const CUSTOMER_API_BASE_URL = "https://abieback.yilakmuluneh.com/api/customer";
// const VEHICLE_API_BASE_URL = "https://abieback.yilakmuluneh.com/api/vehicle";
// const ORDER_API_BASE_URL = "https://abieback.yilakmuluneh.com/api/order";
// const SERVICE_API_BASE_URL = "https://abieback.yilakmuluneh.com/api/services";
// const EMPLOYEE_API_BASE_URL = "https://abieback.yilakmuluneh.com/api/employees";
// const INVENTORY_API_BASE_URL = "https://abieback.yilakmuluneh.com/api/inventory";

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
    const response = await axios.get(CUSTOMER_API_BASE_URL, {
      params: { page, limit, search },
      ...getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching customers in api.js:", error);
    throw error;
  }
};

export const getAllCustomers = async () => {
  try {
    const response = await getCustomers(1, 99999);
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
    const response = await axios.get(ORDER_API_BASE_URL, {
      params: { page, limit, status, includeServices },
      ...getAuthHeader(),
    });

    return {
      data: response.data.data,
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
    console.error("Error creating service:", error);
    throw error;
  }
};

export const updateService = async (serviceId, serviceData) => {
  try {
    const response = await axios.put(
      `${SERVICE_API_BASE_URL}/${serviceId}`,
      serviceData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating service ${serviceId}:`, error);
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

// Inventory API
export const getAllInventoryItems = async () => {
  try {
    const response = await axios.get(INVENTORY_API_BASE_URL, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    throw error;
  }
};

export const getItemTransactionHistory = async (itemId) => {
  try {
    const response = await axios.get(
      `${INVENTORY_API_BASE_URL}/${itemId}/history`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching history for item ${itemId}:`, error);
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to fetch transaction history"
    );
  }
};

export const addInventoryItem = async (itemData) => {
  try {
    const response = await axios.post(
      INVENTORY_API_BASE_URL,
      itemData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error adding inventory item:", error);
    throw error;
  }
};

export const updateStockTransaction = async (transactionData) => {
  try {
    const response = await axios.post(
      `${INVENTORY_API_BASE_URL}/transaction`,
      transactionData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error updating stock transaction:", error);
    throw error;
  }
};

export const getServiceInventoryUsage = async (serviceId) => {
  try {
    const response = await axios.get(
      `${SERVICE_API_BASE_URL}/${serviceId}/inventory`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching inventory for service ${serviceId}:`, error);
    throw error;
  }
};

export const updateServiceInventory = async (serviceId, inventoryUsage) => {
  try {
    const response = await axios.put(
      `${SERVICE_API_BASE_URL}/${serviceId}/inventory`,
      { inventory_usage: inventoryUsage },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating inventory for service ${serviceId}:`, error);
    throw error;
  }
};

// Employee API
export const getAllEmployees = async () => {
  const response = await axios.get(EMPLOYEE_API_BASE_URL, getAuthHeader());
  return response.data.data;
};

export const getAllOrdersForDashboard = async () => {
  const response = await getOrders(1, 99999, "", true);
  return response.data;
};

export const getAllVehicles = async (search = "") => {
  try {
    
    const response = await axios.get(`${VEHICLE_API_BASE_URL}/all`, {
      params: { search }, 
      ...getAuthHeader(),
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all vehicles in api.js:", error);
    throw error;
  }
};
