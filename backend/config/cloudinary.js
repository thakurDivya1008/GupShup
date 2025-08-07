import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const uploadOnCloudinary = async (filePath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath);
    return uploadResult; // Return the full result object
  } catch (error) {
    fs.unlinkSync(filePath);
    console.log("Cloudinary upload error:", error);
    return null;
  }
};

export default uploadOnCloudinary;
