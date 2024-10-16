const { database, auth } = require("../db/firebase.js");
const admin = require("firebase-admin");
const {
  generateRefreshToken,
  generateAccessToken,
  generateTokenAndSetCookies,
} = require("../utils/generateTokenAndSetToken.js");
const { verifyRecaptcha } = require('../utils/verifyRecaptcha.js');


const signup = async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    if (!username || !password || !email || !role) {
      throw new Error("All fields are required");
    }

    const emailSnapshot = await database
      .ref("Users")
      .orderByChild("email")
      .equalTo(email)
      .once("value");

    if (emailSnapshot.exists()) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const usernameSnapshot = await database
      .ref("Users")
      .orderByChild("username")
      .equalTo(username)
      .once("value");

    if (usernameSnapshot.exists()) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const userCredentials = await auth.createUser({
      email: email,
      password: password,
    });

    const userId = userCredentials.uid;

    await database.ref(`Users/${userId}`).set({
      username,
      email,
      role,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    });

    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  const { idToken, recaptchaToken } = req.body;

  const isCaptchaValid = await verifyRecaptcha(recaptchaToken);
  if (!isCaptchaValid) {
      console.error("ReCAPTCHA validation failed.");
      return res.status(400).json({ success: false, message: "Invalid reCAPTCHA" });
  }

  try {
      if (!idToken) {
          return res.status(400).json({ success: false, message: "ID token is required" });
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      const userSnapshot = await database.ref(`Users/${userId}`).once("value");
      if (!userSnapshot.exists()) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      const userData = userSnapshot.val();

      const accessToken = generateTokenAndSetCookies(res, userId);

      res.status(200).json({
          success: true,
          message: "Login successful",
          user: userData,
          accessToken,
      });
  } catch (error) {
      console.error("Error during login:", error.message);
      if (error.code === 'auth/id-token-expired') {
          return res.status(401).json({ success: false, message: "ID token expired" });
      }
      res.status(500).json({ success: false, message: "An error occurred during login" });
  }
};

const checkAuth = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }
    const userSnapshot = await database.ref(`Users/${userId}`).once("value");
    if (!userSnapshot.exists()) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userData = userSnapshot.val();
    res
      .status(200)
      .json({ success: true, user: { ...userData, password: undefined } });
  } catch (error) {
    console.error("Error during checkAuth:", error.message);
  }
};

const logout = async (req, res) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: "no token found" });
  }

  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

module.exports = { signup, login, checkAuth, logout };
