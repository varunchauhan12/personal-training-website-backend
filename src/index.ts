import "dotenv/config";
import cors from "cors";

import express from "express";
import contactRoutes from "./routes/contact.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

app.use("/api/contact", contactRoutes);

// Start the server only if this file is run directly

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
