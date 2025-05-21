const { validationResult } = require('express-validator');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

// @route   POST /api/signup
// @desc    Register a new user and return a JWT
// @access  Public
exports.signup = async (req, res) => {
  // Check for validation errors from express-validator middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation issues, send bad request with details
    return res.status(400).json({ errors: errors.array() });
  }

  // Destructure name, email, and password from the request body
  const { name, email, password } = req.body;

  try {
    // See if a user already exists with the provided email
    let user = await User.findOne({ email });
    if (user) {
      // If so, block registration
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user instance (password hashing happens in the User model pre-save hook)
    user = new User({ name, email, password });
    await user.save(); // Persist user to the database

    // Build JWT payload
    const payload = { id: user._id };

    // Sign token with secret and expiration from environment variables
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Return the signed token
    res.json({ message: 'Signup successful', token });
  } catch (err) {
    console.error(err.message);
    // Internal server error fallback
    res.status(500).send('Server error');
  }
};

// @route   POST /api/login
// @desc    Authenticate user and return a JWT
// @access  Public
exports.login = async (req, res) => {
  // Validate incoming request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract email and password from request
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    // If user doesn't exist or password doesn't match, reject
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Build JWT payload
    const payload = { id: user._id };

    // Sign token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Send token back
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
