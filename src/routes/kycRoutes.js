import express from "express";
import upload from "../middleware/upload.js";

import {
  testRoute,
  uploadKYC,
  registerKYC,
  updateKYC,
  getKYC,
  deleteKYC,
  listUploads,
  storeKYCOnChain
} from "../controllers/kycController.js";

const router = express.Router();

/* -----------------------------
   Test
------------------------------ */
router.get("/test", testRoute);

/* -----------------------------
   File Upload (multer)
------------------------------ */
router.post("/upload", upload.single("file"), uploadKYC);

/* -----------------------------
   KYC CRUD (Off-chain)
------------------------------ */
router.post("/register", registerKYC);
router.put("/update", updateKYC);
router.get("/get/:userId", getKYC);
router.delete("/delete/:userId", deleteKYC);

/* -----------------------------
   Blockchain (On-chain)
------------------------------ */
router.post("/store-onchain", storeKYCOnChain);

/* -----------------------------
   Debug / Utility
------------------------------ */
router.get("/list-uploads", listUploads);

export default router;
