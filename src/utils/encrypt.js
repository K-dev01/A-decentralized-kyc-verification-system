// src/utils/encrypt.js
import crypto from "crypto";

/**
 * AES-256-CTR encrypt / decrypt helpers.
 * - key must be a 32-byte hex string (64 hex chars) in .env AES_KEY
 */

const ALGORITHM = "aes-256-ctr";

export function encryptJSON(obj, hexKey) {
  const text = JSON.stringify(obj);
  const key = Buffer.from(hexKey, "hex");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(Buffer.from(text, "utf8")), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
}

export function decryptJSON(encryptedObj, hexKey) {
  const key = Buffer.from(hexKey, "hex");
  const iv = Buffer.from(encryptedObj.iv, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedObj.content, "hex")),
    decipher.final(),
  ]);
  try {
    return JSON.parse(decrypted.toString("utf8"));
  } catch (e) {
    throw new Error("Failed to parse decrypted JSON");
  }
}
