import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.resolve("uploads/profile");
const srcUploadPath = path.resolve("src/uploads/profile");

// Create folders if they don't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
if (!fs.existsSync(srcUploadPath)) {
  fs.mkdirSync(srcUploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      ext;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExts = /^\.(jpe?g|png|webp)$/i;
  const allowedMimes = /^image\/(jpeg|jpg|png|webp)$/i;

  const ext = path.extname(file.originalname).toLowerCase();
  const isValidExt = allowedExts.test(ext);
  const isValidMime = allowedMimes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Please upload a valid image file (JPEG, PNG, or WebP)"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

export default upload;