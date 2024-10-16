const jwt = require('jsonwebtoken');

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "15d"
    });
};

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

const generateTokenAndSetCookies = (res, userId) => {
    const refreshToken = generateRefreshToken(userId);
    const accessToken = generateAccessToken(userId);

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 24 * 60 * 60 * 1000 // 15 days
    });

    return { accessToken, refreshToken };
};

module.exports = { generateRefreshToken, generateAccessToken, generateTokenAndSetCookies };
