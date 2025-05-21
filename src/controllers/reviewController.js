const Review = require('../models/Review');

// @route   POST /api/books/:id/reviews
// @desc    Add a new review to a book
// @access  Protected (requires authentication)
exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  
  // Create a new review associated with the book and the current user
  const review = new Review({ book: req.params.id, user: req.user, rating, comment });
   // Save review to the database
  await review.save();
  // Respond with the created review
  res.status(201).json({message: 'Review created successfully',review});
};

// @route   PUT /api/reviews/:id
// @desc    Update a review (only by the user who created it)
// @access  Protected
exports.updateReview = async (req, res) => {
    // Find the review by its ID
  let review = await Review.findById(req.params.id);
   // Check if review exists and belongs to the requesting user
  if (!review || review.user.toString() !== req.user)
    return res.status(404).json({ msg: 'Review not found or unauthorized' });
  // Update the review with new data
  review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  // Respond with the updated review
  res.json({message: 'Review Updated successfully',review});
};
// @route   DELETE /api/reviews/:id
// @desc    Delete a review (only by the user who created it)
// @access  Protected
exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review || review.user.toString() !== req.user) {
    return res.status(404).json({ message: 'Review not found or unauthorized' });
  }

  await review.deleteOne();   // <-- use deleteOne() instead of remove()
  res.json({ message: 'Review deleted successfully' });
};
