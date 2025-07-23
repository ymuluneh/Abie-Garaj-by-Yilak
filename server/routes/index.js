// Import express
const express = require("express");
const Router = express.Router(); // Create new Express Router

// Import route modules
const employeeRouter = require("./employeeRoute");
const loginRouter = require("./loginRoute");
const customerRoutes = require("./customerRoutes");
const vehicleRoutes = require("./vehicle.route"); // Make sure this path is correct
const orderRoutes = require("./orderRoutes");

// ... other uses
Router.use("/vehicle", vehicleRoutes); // This line is already there, ensure it's correct


// Mount customer-related routes at /api/customer
Router.use("/customer", customerRoutes);

// Mount employee-related routes
Router.use("/employees", employeeRouter);

// Mount login/authentication routes
Router.use("/employee", loginRouter);

// Mount order routes
Router.use('/order', orderRoutes);
// Export all configured routes
module.exports = Router;
