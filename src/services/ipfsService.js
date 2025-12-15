// src/services/ipfsService.js
import { create } from "ipfs-http-client";
import { encryptJSON, decryptJSON } from "../utils/encrypt.js";


const projectId = process.env.IPFS_PROJECT_ID;
const projectSecret = process.env.IPFS_PROJECT_SECRET;
const apiUrl = process.env.IPFS_API_URL || "https://ipfs.infura.io:5001/api/v0";

let client;
if (projectId && projectSecret) {
  const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
  client = create({
    url: apiUrl,
    headers: {
      authorization: auth,
    },
  });
} else {
  // If no auth provided, try public node
  client = create({ url: apiUrl });
}

/**
 * uploadToIPFS: encrypts data then stores to IPFS, returns CID
 * data: object
 * aesKey: hex string (from .env AES_KEY)
 */
export async function uploadToIPFS(data, aesKey) {
  const encrypted = encryptJSON(data, aesKey);
  const buffer = Buffer.from(JSON.stringify(encrypted));
  const added = await client.add(buffer);
  // added has .cid; return the CID string
  return added.cid.toString();
}

/**
 * downloadFromIPFS: fetches the CID, decrypts with aesKey, returns original object
 */
export async function downloadFromIPFS(cid, aesKey) {
  const chunks = [];
  for await (const chunk of client.cat(cid)) {
    chunks.push(chunk);
  }
  const file = Buffer.concat(chunks).toString("utf8");
  const encryptedObj = JSON.parse(file);
  const decrypted = decryptJSON(encryptedObj, aesKey);
  return decrypted;
}
