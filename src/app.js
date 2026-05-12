const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const librariesRoutes = require("./routes/libraries");
const booksRoutes = require("./routes/books");
const authorsRoutes = require("./routes/authors");
const membersRoutes = require("./routes/members");
const usersRoutes = require("./routes/users");
const loansRoutes = require("./routes/loans");
const reservationsRoutes = require("./routes/reservations");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ===== HEALTH CHECK =====
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ===== API ROUTES (v1) =====

// Authentication routes
app.use("/api/v1/auth", authRoutes);

// Library routes
app.use("/api/v1/libraries", librariesRoutes);

// Books routes
app.use("/api/v1/books", booksRoutes);

// Authors routes (nested under books)
app.use("/api/v1/books/:bookId/authors", authorsRoutes);

// Members routes
app.use("/api/v1/members", membersRoutes);

// Users routes
app.use("/api/v1/users", usersRoutes);

// Loans routes
app.use("/api/v1/loans", loansRoutes);

// Reservations routes
app.use("/api/v1/reservations", reservationsRoutes);

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = app;
