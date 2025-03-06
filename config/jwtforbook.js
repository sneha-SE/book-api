const jwt = require("jsonwebtoken");

const bookAuthMiddleware = (req, res, next) => {
    try {
        const token = req.header("Authorization"); 

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No book token provided." });
        }

        
        const decoded = jwt.verify(token, "BOOK_SECRET_KEY"); 
        req.book = decoded; 

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired book token" });
    }
};

module.exports = bookAuthMiddleware;
