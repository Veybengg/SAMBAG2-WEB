const jwt = require('jsonwebtoken');

const verificationToken = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({ success: false, message: "Unauthorized - No token found" });
    }
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId; 
        return next(); 
    } catch (err) {
        console.error('Access token verification error:', err);
    }
};

module.exports = { verificationToken };
