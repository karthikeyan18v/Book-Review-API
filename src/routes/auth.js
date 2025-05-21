const express = require('express');
const { check } = require('express-validator');
const { signup, login } = require('../controllers/authController');
const router = express.Router(); // Initialize router

// @route   POST /api/signup
// @desc    Register a new user
// @access  Public
router.post(
  '/signup',
  [ check('name','Name required').notEmpty(),
    check('email','Valid email').isEmail(),
    check('password','Min 6 chars').isLength({ min: 6 }) ],
  signup // Controller to handle the logic
);
// @route   POST /api/login
// @desc    Log in a user
// @access  Public
router.post(
  '/login',
  [ check('email','Valid email').isEmail(),
    check('password','Password required').exists() ],
  login // Controller to handle login logic
);

module.exports = router;
