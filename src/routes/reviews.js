const express = require('express');
const { check } = require('express-validator');
const auth    = require('../middleware/auth');
const { addReview, updateReview, deleteReview } = require('../controllers/reviewController');
const router = express.Router();
// @route   POST /api/books/:id/reviews
// @desc    Add a review to a specific book
// @access  Private
router.post(
  '/:id/reviews',
  [ auth, check('rating','Rating 1–5').isInt({ min: 1, max: 5 }) ],
  addReview
);
// @route   PUT /api/reviews/:id
// @desc    Update a review by its ID (only by the user who created it)
// @access  Private
router.put('/reviews/:id', auth, updateReview);
// @route   DELETE /api/reviews/:id
// @desc    Delete a review by its ID (only by the user who created it)
// @access  Private
router.delete('/reviews/:id', auth, deleteReview);

module.exports = router;
