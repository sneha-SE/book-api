const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ["admin"] 
    },
    token: {
        type: String
    }
}, { timestamps: true }); // timestamps se `createdAt` aur `updatedAt` fields milengi

const admin = mongoose.model('admin', adminSchema);

module.exports = admin;
