const express = require('express');
const { checkAuth,signup,login,logout } = require('../controller/auth.controller.js');
const {verificationToken} = require('../middleware/accessToken.middleware.js')
const router = express.Router();


router.get('/check-auth',verificationToken,checkAuth)
router.post('/signup', signup);
router.post('/login', login)
router.post('/logout',logout)

module.exports = router;
