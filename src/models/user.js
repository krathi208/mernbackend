// models/User.js
const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        // trim: true
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        // required: true,
    },
    dob: {
        type: Date,
        required: true
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User
