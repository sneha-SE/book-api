const bcrypt = require("bcrypt");
const admin = require("../models/adminModel");
const {generateToken} = require('../config/jwt');
const Users = require("../models/userModel");


const adminLogin = async (req, res) => {

    try{
        const {email, password, role} = req.body;
       
        if(email !== "admin@example.com" || !role){
            return res.status(401).json({status: false, message: "unauthorized admin"});
        };

        const hashedPassword = await bcrypt.hash("admin123", 10);
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if(!isMatch){
            return res.status(401).json({status: false, message: "invalid credential"});
        }

        const adminData = { email: "admin@example.com", role: "admin" , password: "admin123"}; // Replace with actual admin ID
        console.log(" Admin Data Before Token Generation:", adminData);
        const token = generateToken(adminData);
        console.log(" Generated Token:", token);

        const newAdmin = new admin({ email, password: hashedPassword, role, token});
        const saveAdmin = await newAdmin.save();
        console.log("saveAdmin", saveAdmin);

        res.status(200).json({ status: true, message: "Admin Logged In", token });
    }
    catch(error) {
        console.log("error in admin login", error);
        res.status(500).json({ status: false, message: "Server Error", error: error.message })
    }
};

const adminCanGetAllUsers = async (req, res) => {
    try {
        // Directly fetch all users from the database (excluding passwords)
        const users = await Users.find({}, "-password");
        console.log(" Users Fetched:", users);

        if (!users) {
            return res.status(404).json({ status: false, message: "No Users Found" });
        }

        res.status(200).json({ status: true, message: "All Users Fetched", data: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ status: false, message: "Server Error", error: error.message });
    }
};

const adminCanDeleteUsers = async (req, res) => {
    try {
        // Admin authentication check karo
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ status: false, message: "Access Denied! Not an Admin" });
        }

        const { userId } = req.params; // Frontend/Postman se user ID milegi

        // Check if user exists
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // Delete the user
        await Users.findByIdAndDelete(userId);

        res.status(200).json({ status: true, message: "User Deleted Successfully" });
    } catch (error) {
        console.error(" Error deleting user:", error);
        res.status(500).json({ status: false, message: "Server Error", error: error.message });
    }
};


//* Admin Login – Secure login with JWT == DONE
//?  User Management – List == Done, Delete, Block users
//?  Product/Content Management – Add, Edit, Delete products or posts
//?  Dashboard – Stats, analytics

module.exports = {adminLogin, adminCanGetAllUsers, adminCanDeleteUsers}