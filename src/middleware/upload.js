import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      console.log('Multer destination - headers content-type:', req.headers['content-type']);
      console.log('Multer destination - req.is multipart:', req.is && req.is('multipart/form-data'));
    } catch (err) {
      console.error('Multer destination logging error:', err);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    console.log('Multer filename handler - file mimetype:', file && file.mimetype, 'originalname:', file && file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export default upload;
