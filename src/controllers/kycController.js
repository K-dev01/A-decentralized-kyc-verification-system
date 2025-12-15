import fs from "fs";
import path from "path";
import contract from "../blockchain/contract.js";

// Temporary in-memory DB
let kycDB = {};

/* ---------------------------------------------------
   Test Route
---------------------------------------------------- */
export const testRoute = (req, res) => {
  res.status(200).json({ message: "Test route working!" });
};

/* ---------------------------------------------------
   Upload KYC File (LOCAL STORAGE ONLY)
---------------------------------------------------- */
export const uploadKYC = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded. Use form-data with key 'file'."
      });
    }

    res.status(200).json({
      message: "File uploaded successfully",
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path
      }
    });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "File upload failed" });
  }
};

/* ---------------------------------------------------
   Register KYC (OFF-CHAIN)
---------------------------------------------------- */
export const registerKYC = async (req, res) => {
  try {
    const { userId, name, aadhar, pan } = req.body;

    if (!userId || !name || !aadhar || !pan) {
      return res.status(400).json({ message: "All fields required" });
    }

    kycDB[userId] = { name, aadhar, pan };

    res.status(200).json({
      message: "KYC registered successfully",
      data: kycDB[userId]
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   Update KYC (OFF-CHAIN)
---------------------------------------------------- */
export const updateKYC = async (req, res) => {
  try {
    const { userId, name, aadhar, pan } = req.body;

    if (!userId || !kycDB[userId]) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) kycDB[userId].name = name;
    if (aadhar) kycDB[userId].aadhar = aadhar;
    if (pan) kycDB[userId].pan = pan;

    res.status(200).json({
      message: "KYC updated",
      data: kycDB[userId]
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   Get KYC (OFF-CHAIN)
---------------------------------------------------- */
export const getKYC = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!kycDB[userId]) {
      return res.status(404).json({ message: "KYC not found" });
    }

    res.status(200).json({
      message: "KYC fetched",
      data: kycDB[userId]
    });

  } catch (error) {
    console.error("Get Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   Delete KYC (OFF-CHAIN)
---------------------------------------------------- */
export const deleteKYC = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!kycDB[userId]) {
      return res.status(404).json({ message: "User not found" });
    }

    delete kycDB[userId];

    res.status(200).json({ message: "KYC deleted" });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------
   Store KYC ON-CHAIN (CORRECT ABI USAGE)
---------------------------------------------------- */
export const storeKYCOnChain = async (req, res) => {
  try {
    const { name, emailHash, ipfsMetadataHash } = req.body;

    if (!name || !emailHash || !ipfsMetadataHash) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const tx = await contract.registerIdentity(
      name,
      emailHash,
      ipfsMetadataHash
    );

    await tx.wait();

    res.status(200).json({
      message: "KYC stored on blockchain",
      txHash: tx.hash
    });

  } catch (error) {
    console.error("Blockchain Error:", error);
    res.status(500).json({ message: "Blockchain transaction failed" });
  }
};

/* ---------------------------------------------------
   List uploaded files (debug)
---------------------------------------------------- */
export const listUploads = async (req, res) => {
  try {
    const uploadsDir = path.resolve(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) return res.status(200).json({ files: [] });
    const files = await fs.promises.readdir(uploadsDir);
    res.status(200).json({ files });
  } catch (err) {
    console.error("listUploads error:", err);
    res.status(500).json({ message: "Server error", error: String(err) });
  }
};

/* ---------------------------------------------------
   Test NFT storage token presence (debug)
---------------------------------------------------- */
export const testNFTStorage = async (req, res) => {
  try {
    res.status(200).json({ nftTokenPresent: !!process.env.NFT_STORAGE_TOKEN });
  } catch (err) {
    console.error("testNFTStorage error:", err);
    res.status(500).json({ message: "Server error", error: String(err) });
  }
};
