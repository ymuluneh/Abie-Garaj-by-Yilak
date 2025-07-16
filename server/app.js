const express = require("express");
const cors = require("cors");
require("dotenv").config();
//sanitization

const { pool } = require("./config/config"); // DB pool
const createSchema = require("./config/dbSetup"); // ✅ Import schema creation
const Routes = require("./routes/index");

const app = express();

// 🔹 Middlewares
//cors allow cross-origin requests only from specfice origin
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"], credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Initialize database schema
//createSchema(); //* Run schema.sql to create DB + tables

// 🔹 Use routes
app.use("/api", Routes);

// 🔹 Test DB connection
pool
  .getConnection() 
  .then((connection) => {
    console.log("✅ Database connected successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });

// 🔹 Server Listener
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
