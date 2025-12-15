import PinataSDK from "pinata-web3";
import fs from "fs";
import path from "path";

const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_KEY,
});

// Upload file to IPFS
export const uploadToIPFS = async (req, res) => {
  try {
    console.log("uploadToIPFS: headers:", req.headers["content-type"] || "(no content-type)");
    console.log("uploadToIPFS: req.file:", req.file);
    console.log("uploadToIPFS: req.body:", req.body);
    console.log("uploadToIPFS: req.is multipart:", req.is && req.is('multipart/form-data'));
    if (!req.file) {
      const isMulti = req.is && req.is('multipart/form-data');
      const hint = isMulti ? "Missing 'file' field in form-data" : "Request is not multipart/form-data";
      return res.status(400).json({ message: "No file uploaded", hint, contentType: req.headers["content-type"] });
    }

    const filePath = path.resolve(req.file.path);
    const fileStream = fs.createReadStream(filePath);

    const result = await pinata.upload.file(fileStream);
    console.log('Pinata upload result:', result);

    // Optionally delete local file after upload (set DELETE_AFTER_UPLOAD=true to enable)
    if (process.env.DELETE_AFTER_UPLOAD === "true") {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({
      message: "File uploaded to IPFS",
      ipfsHash: result.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    });

  } catch (error) {
    console.error("IPFS Upload Error:", error);
    // Include error details if available
    const details = error?.response?.data || error?.message || String(error);
    res.status(500).json({ message: "IPFS upload failed", error: details });
  }
};
