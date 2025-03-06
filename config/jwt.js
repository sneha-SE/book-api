const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;


const generateToken = (payload) => {
    console.log(" Payload while generating token:", payload);
    return jwt.sign(payload, SECRET_KEY);
};

const verifyToken = async (token) => {
    try {
        const verifying = await jwt.verify(token, SECRET_KEY);
        console.log(" Decoded Token:", verifying);
        return verifying; 

    } catch (error) {
        console.log("Error in JWT:", error);
        return null; 
    }
};


module.exports = {generateToken, verifyToken};