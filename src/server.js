/*import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("KYC Backend is working!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import kycRoutes from "./routes/kycRoutes.js";
import path from "path";

// Load environment variables from src/.env to ensure variables are picked up
dotenv.config({ path: "src/.env" });

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files from /uploads URL path
const uploadsPath = path.resolve(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));
console.log("Serving uploads from:", uploadsPath);

// Register all KYC routes
app.use("/api/kyc", kycRoutes);

app.get("/", (req, res) => {
    res.send("KYC Backend is working!");
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment summary:', {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: PORT,
    NFT_STORAGE_TOKEN: !!process.env.NFT_STORAGE_TOKEN,
    PINATA_API_KEY: !!process.env.PINATA_API_KEY
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try killing the process using that port or set a different PORT environment variable.`);
  } else {
    console.error('Server error during startup:', err);
  }
});

// Global error handlers to catch uncaught exceptions/rejections during runtime
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  // Optionally exit process in production: process.exit(1)
});
