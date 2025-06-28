const express = require('express');
const router = express.Router();
const {signup, login, forgotPassword} = require('../services/authService');
const {signupValidator, loginValidator} = require('../utils/validators/authValidator');


router.route('/signup')
    .post(signupValidator, signup);

router.route('/login')
    .post(loginValidator, login);

router.route('/forgot-password')
    .post(forgotPassword);

module.exports = router;