const { verifyToken } = require("../config/jwt");
const Admin = require("../models/adminModel");

const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        
        if (!token) {
            console.log(" No Token Provided!");
            return res.status(401).json({ status: false, message: "Access Denied! No Token Provided." });
        }

        const formattedToken = token.replace("Bearer", "").trim();
        console.log(" Received Token:", formattedToken);

        const decoded = await verifyToken(formattedToken);
        console.log(" Decoded Token:", decoded);

        if (!decoded || !decoded.email || !decoded.role) {
            console.log(" Invalid Token!");
            return res.status(400).json({ status: false, message: "Invalid Token!" });
        }

        const adminExists = await Admin.findOne({email: decoded.email});
        if (!adminExists) {
            console.log(" Admin Not Found in DB!");
            return res.status(404).json({ status: false, message: "Admin Not Found!" });
        }

        if (decoded.role !== "admin") {
            console.log(" Not an Admin!");
            return res.status(403).json({ status: false, message: "Forbidden! Not an Admin." });
        }

        console.log(" Admin Authenticated:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(" Error in Admin Authentication:", error);
        res.status(500).json({ status: false, message: "Server Error", error: error.message });
    }
};

module.exports = authenticateAdmin;
