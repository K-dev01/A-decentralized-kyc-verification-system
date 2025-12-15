#  KYC Backend System (Blockchain-based)

This repository contains the **Level 1 complete backend implementation** of a KYC (Know Your Customer) system built using **Node.js, Express, IPFS, and Blockchain (Polygon Amoy Testnet)**.

This README is written so that **any evaluator, teammate, or developer** can clone the repo and run it without confusion.

---

##  Tech Stack

* **Node.js** (ES Modules)
* **Express.js** (Backend framework)
* **Multer** (File uploads)
* **IPFS** (via NFT.Storage / Pinata)
* **Ethers.js v6** (Blockchain interaction)
* **Polygon Amoy Testnet**
* **dotenv** (Environment variables)

---

## 📁 Project Structure

```bash
kyc-backend/
│
├── src/
│   ├── blockchain/
│   │   ├── abi.json
│   │   └── contract.js
│   │
│   ├── controllers/
│   │   └── kycController.js
│   │
│   ├── middleware/
│   │   └── upload.js
│   │
│   ├── routes/
│   │   └── kycRoutes.js
│   │
│   ├── server.js
│
├── uploads/              # Local file storage (ignored in git)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

##  Prerequisites

Make sure you have:

* Node.js **v18+** (recommended)
* npm
* Git
* Polygon Amoy test wallet (MetaMask)

---

##  Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd kyc-backend
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Environment Variables Setup

Create a `.env` file in the project root using `.env.example` as reference.

```bash
cp .env.example .env
```

#### Example `.env`

```env
PORT=5000
NODE_ENV=development

# Blockchain
RPC_URL=https://polygon-amoy.infura.io/v3/YOUR_RPC_KEY
PRIVATE_KEY=0xYOUR_TESTNET_PRIVATE_KEY
CONTRACT_ADDRESS=0xSMART_CONTRACT_ADDRESS

# IPFS
NFT_STORAGE_TOKEN=YOUR_NFT_STORAGE_TOKEN
PINATA_API_KEY=YOUR_PINATA_KEY
PINATA_SECRET_KEY=YOUR_PINATA_SECRET
```

⚠️ **IMPORTANT:**

* Never commit `.env`
* Never expose private keys

---

### 4️⃣ Start the Server

```bash
npm start
```

Expected output:

```bash
Server running on port 5000
Serving uploads from: /uploads
Environment summary: { ... }
```

---

##  API Testing (Postman)

Base URL:

```
http://localhost:5000/api/kyc
```

---

### 🔹 1. Test Server

**GET** `/test`

Response:

```json
{ "message": "Test route working!" }
```

---

### 🔹 2. Upload KYC File (Local Storage)

**POST** `/upload`

**Body → form-data**

| Key  | Type | Value       |
| ---- | ---- | ----------- |
| file | File | PDF / Image |

Response:

```json
{
  "message": "File uploaded successfully",
  "fileDetails": {
    "originalName": "doc.pdf",
    "fileName": "12345.pdf",
    "storedAt": "uploads/12345.pdf"
  }
}
```

---

### 🔹 3. Register KYC (Off-chain)

**POST** `/register`

```json
{
  "userId": "user123",
  "name": "Alice",
  "aadhar": "XXXX-XXXX",
  "pan": "ABCDE1234F"
}
```

---

### 🔹 4. Update KYC

**PUT** `/update`

```json
{
  "userId": "user123",
  "name": "Updated Name"
}
```

---

### 🔹 5. Get KYC

**GET** `/get/user123`

---

### 🔹 6. Delete KYC

**DELETE** `/delete/user123`

---

### 🔹 7. List Uploaded Files (Debug)

**GET** `/list-uploads`

---

### 🔹 8. Store KYC Hash On-Chain

**POST** `/store-onchain`

```json
{
  "userId": "user123",
  "fileHash": "QmXYZ123"
}
```

Response:

```json
{
  "message": "KYC hash stored on blockchain",
  "txHash": "0x..."
}
```

---

##  Blockchain Integration

* Network: **Polygon Amoy Testnet**
* Library: **ethers.js v6**
* Contract ABI loaded from `abi.json`
* Wallet created using PRIVATE_KEY

All blockchain logic is isolated inside:

```
src/blockchain/contract.js
```

---

##  Security Notes

* `.env` is ignored via `.gitignore`
* Only hashes are stored on-chain
* No sensitive data is pushed to GitHub
* Files stored locally (IPFS optional at higher levels)

---

##  Level 1 Completion Checklist

✔ Express backend setup
✔ File upload handling
✔ KYC CRUD APIs
✔ Blockchain connection
✔ On-chain hash storage
✔ Environment security
✔ Postman tested APIs
✔ Clean project structure

---

##  Next Levels (Optional)

* AES encryption before IPFS upload
* On-chain identity verification
* Role-based access control
* Frontend integration
* Deployment

---

##  Author

Backend Developer – KYC Blockchain System

---

This completes **Level 1 backend deliverable**.
