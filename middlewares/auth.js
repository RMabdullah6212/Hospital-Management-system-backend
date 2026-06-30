import { catchAsyncErrors } from "./catchAsyncErrors.js";
import { ErrorHandler } from "./errorMiddleware.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.admintoken;
    if (!token) {
        return next(new ErrorHandler("Admin not authenticated", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Admin") {
        return next(new ErrorHandler("Admin not authenticated", 403));
    }
    next();
})


export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.patienttoken;
    if (!token) {
        return next(new ErrorHandler("Patient not authenticated", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Patient") {
        return next(new ErrorHandler("Patient not authenticated", 403));
    }
    next();
})