const { verifyToken } = require("../config/jwt");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ error: "Access Denied, No Token Provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token Not Found" });
    }

    const decoded = await verifyToken(token);
    console.log("token:", token);
    

    console.log("Decoded Token:", decoded); // Debugging

    if (!decoded) {
      return res.status(400).json({ error: "Invalid Token" });
    }

    const user = await User.findById(decoded.id);
    console.log("user", user);
    

    if (!user) {
      return res.status(403).json({ error: "User Not Found" });
    }

    if (user.token !== token) {
      console.log("Stored Token:", user.token);
      console.log("Provided Token:", token);
      return res.status(403).json({ error: "Invalid or Expired Token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in token verifying:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = authMiddleware;
