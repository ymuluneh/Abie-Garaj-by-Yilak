const express = require("express");
const cors = require("cors");
require("dotenv").config();
//sanitization

const { pool } = require("./config/config"); // DB pool
const createSchema = require("./config/dbSetup"); // ✅ Import schema creation
const Routes = require("./routes/index");

const app = express();//start the cns of server  and node js

// 🔹 Middlewares
//cors allow cross-origin requests only from specfice origin
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Initialize database schema
createSchema(); //* Run schema.sql to create DB + tables

// 🔹 Use routes
app.use("/api", Routes);

// 🔹 Test DB connection
app.get("/test", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query("SELECT 1 + 1 AS solution");
    connection.release();
    res.status(200).json({ message: "Database connection successful!" });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed." });
  }
});


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
const PORT = process.env.PORT
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
