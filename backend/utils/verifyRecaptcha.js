const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const RECAPTCHA_SECRET_KEY = "6LdR91cqAAAAAN1dgH17coR0Rbc3B0hWBNhx_Wuf";

const verifyRecaptcha = async (token) => {
  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      },
    });

    return response.data.success;
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error.message);
    return false; // Return false if verification fails
  }
};

module.exports = { verifyRecaptcha };
