import mongoose from "mongoose";
import validator from "validator";


const appointmentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "First name must be at least 3 characters long"],
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, "Last name must be at least 3 characters long"],
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please provide a valid email address"],
    },
    phone: {
        type: String,
        required: true,
        minLength: [11, "Phone number must be of 11 digits"],
        maxLength: [11, "Phone number must be of 11 digits"],

    },
    nic: {
        type: String,
        required: true,
        minLength: [13, "NIC number must be of 11 digits"],
        maxLength: [13, "NIC number must be of 11 digits"],
    },
    dob: {
        type: Date,
        required: [true, "Date of birth is required"],
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
    },
    role: {
        type: String,
        required: true,
        enum: ["Admin", "Patient", "Doctor"],
        default: "Patient",
    },
    appointment_date: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    doctor: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
    },
    hasVisited: {
        type: Boolean,
        default: false,
    },
    doctorId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    patientId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
