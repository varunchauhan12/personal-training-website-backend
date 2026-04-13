import "dotenv/config";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import express from "express";
import contactRoutes from "./routes/contact.routes.js";
import { auth } from "../lib/auth.js";
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to your frontend URL
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

// Routes

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
  });
});

app.use("/api/contact", contactRoutes);

// Start the server only if this file is run directly

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
