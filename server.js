import express from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

import app from "./app.js";

    const allowedOrigins = [
      "http://localhost:5173",
      "https://hospital-management-system-frontend-green.vercel.app",
      "https://hospital-management-system-fro-git-7e3a2d-muhammad-abdullah6212.vercel.app"
    ];

    app.use(cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    }));

    app.options("*", cors()); // Ye Preflight ke liye hai