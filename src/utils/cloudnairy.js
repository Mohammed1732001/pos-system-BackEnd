import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

console.log("CLOUDINARY CONFIG:");
console.log({
  cloud_name: process.env.CLOUD_NAME ? "Done CLOUD_NAME" : "Not found CLOUD_NAME",
  api_key: process.env.API_KEY ? "Done API_KEY" : "Not found API_KEY" ,
  api_secret: process.env.API_SECRET ? "Done Api Secret" : "API_SECRET"
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default cloudinary;
