// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { signupValidation, loginValidation } = require('../utils/validators');
const validateRequest = require('../middlewares/validateRequest');

router.post('/signup', signupValidation, validateRequest, authController.signup);
router.post('/login', loginValidation, validateRequest, authController.login);

module.exports = router;