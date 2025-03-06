const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    token: {
        type: String
    }
}, { timestamps: true }); // timestamps se `createdAt` aur `updatedAt` fields milengi

const users = mongoose.model('users', userSchema);

module.exports = users;
