import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// Express app instance
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json()); // To parse JSON body
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded body

// Route
app.use("/api/v1/auth", authRoutes);

// JSON parser error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format",
      error: err.message,
    });
  }
  next(err);
});

export default app;