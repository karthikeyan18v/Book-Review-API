const express = require('express');
const { check } = require('express-validator');
const auth     = require('../middleware/auth');
const { createBook, getBooks, getBookById } = require('../controllers/bookController');
const router = express.Router();
// @route   POST /api/books
// @desc    Create a new book (only for authenticated users)
// @access  Private
router.post(
  '/',
  [ auth, check('title','Title required').notEmpty(), check('author','Author required').notEmpty() ],
  createBook
);
// @route   GET /api/books
// @desc    Get all books with optional filters and pagination
// @access  Public
router.get('/', getBooks);
// @route   GET /api/books/:id
// @desc    Get a single book by ID including average rating and reviews
// @access  Public
router.get('/:id', getBookById);

module.exports = router;
