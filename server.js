import express from "express";
import cors from "cors";
const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://hospital-management-system-frontend-green.vercel.app",],
    credentials: true
}
));

import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

import app from "./app.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.VERCEL){
  app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
}
export default app;