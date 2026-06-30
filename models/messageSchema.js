import express from "express";
import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
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
    message: {
        type: String,
        required: true,
        minLength: [10, "Message must be at least 10 characters long"],
    },
    
});
export const Message = mongoose.model("Message", messageSchema);