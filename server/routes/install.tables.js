//import { pool } from "../config/config";
const express = require("express");
const { pool } = require("../config/config"); // ✅ Import only the pool
const createTablesRouter = express.Router();
const createTables = require("../controllers/install.tables.controller")

// 🔹 Create tables route
createTablesRouter.post("/install", createTables.createTablesController);
// 🔹 Export the router
module.exports = createTablesRouter;
