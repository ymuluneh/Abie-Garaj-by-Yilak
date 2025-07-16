//import employeeRoutes from "./employeeRoutes";
const employeeRouter = require("./employeeRoute");
const loginRouter = require("./loginRoute");
//
const express = require("express");
const Router = express.Router();
Router.use("/employees", employeeRouter);
Router.use("/employee", loginRouter);



//export all routes
module.exports = Router;
