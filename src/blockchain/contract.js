import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

console.log("PRIVATE_KEY length:", process.env.PRIVATE_KEY?.length);

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const abi = JSON.parse(
  fs.readFileSync(path.resolve("src/blockchain/abi.json"), "utf-8")
);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  wallet
);

export default contract;
