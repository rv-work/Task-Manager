import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage
export const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    return {
      folder: "profile",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: `profile-${uniqueSuffix}`,
    };
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg and .png formats are allowed"), false);
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;






// configure storage.....local
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/")
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`)
//   },
// })

