import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import { ErrorHandler } from "../middlewares/errorMiddleware.js"
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors( async (req, res, next) => {
    const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;
    if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender  || !password ) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }
    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User already exists", 400));
    }
    user = await User.create({ firstName, lastName, email, phone, nic, dob, gender, password, role: "Patient" });
    generateToken(user, "User registered successfully", 200, res);
})

export const login = catchAsyncErrors( async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;
    if (!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler("user not found", 400));
    } 
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }
    if (password !== confirmPassword) {
        return next(new ErrorHandler("Password and confirm password do not match", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }
    if (role !== user.role) {
        return next(new ErrorHandler("Invalid role", 400));
    }
    // jsonwebtoken jo hein user id and secret key and expire time ko sign karta hai aur token generate karta hai isse user ko authenticate karne ke liye use kiya jata hai or ye user ko login device par yaad rakhne ke liye use kiya jata hai specially jab user apne account me login karta hai to token generate hota hai aur usse user ke browser me store kar diya jata hai taki user ko baar baar login na karna pade aur jab user apne account se logout karta hai to token ko delete kar diya jata hai taki user ko phir se login karna pade.
    generateToken(user, "User logged in successfully", 200, res);
    
})



export const addNewAdmin = catchAsyncErrors( async (req, res, next) =>{
    const { firstName, lastName, email, phone, nic, dob, gender, password} = req.body;
    if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password) {
        return next(new Error("Please fill all the required fields"));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new Error("Admin already exists"));
    }
    const admin = await User.create({ firstName, lastName, email, phone, nic, role: "Admin",});
    res.status(200).json({
        success: true,
        message: `${isRegistered.role} created successfully`,
        user: admin
    });
})

export const getAllDoctors = catchAsyncErrors( async (req, res, next) => {
    const doctors = await User.find({ role: "Doctor" });
    res.status(200).json({
        success: true,      doctors
    });
});


export const getUserDetails = catchAsyncErrors( async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user
    });
});

export const logoutAdmin = catchAsyncErrors( async (req, res, next) => {
    res.status(200).cookie("admintoken", null, {
        httpOnly: true,
        expires: new Date(Date.now())
    }).json({
        success: true,
        message: "Admin logged out successfully"
    });
} );
export const logoutPatient = catchAsyncErrors( async (req, res, next) => {
    res.status(200).cookie("patienttoken", null, {
        httpOnly: true,
        expires: new Date(Date.now())
    }).json({
        success: true,
        message: "Patient logged out successfully"
    });
} );

export const addNewDoctor = catchAsyncErrors( async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Doctor Avatar Required", 400));
    }
    const { docAvatar } = req.files;
    const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
        return next(new ErrorHandler("Invalid file format", 400));
    }
    const { firstName, lastName, email, phone, nic, dob, gender, password, doctorDepartment } = req.body;
    if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password || !doctorDepartment) {
        return next(new ErrorHandler("Please fill all the required fields", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} already exists with this email`,400));
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary upload error:", cloudinaryResponse && cloudinaryResponse.error);    
    }
    const doctor = await User.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        doctorDepartment,
        role: "Doctor",
        docAvatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    });
        res.status(200).json({
            success: true,
            message: "Doctor Registered successfully",
            user: doctor
        });
});