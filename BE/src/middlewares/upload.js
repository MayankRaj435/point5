import fs from "fs";
import multer from "multer";
import path from "path";

export function createUploader(folder, allowedTypes = [], maxFileSize = 5 * 1024 * 1024) {
  const uploadDir = path.join(process.cwd(), folder);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, safeName);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.length === 0) return cb(null, true);

    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    const error = new Error("Invalid file type");
    error.status = 400;
    return cb(error, false);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxFileSize,
    },
  });
}
