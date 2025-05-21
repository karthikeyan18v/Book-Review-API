const Book   = require('../models/Book');
const Review = require('../models/Review');
// @route   POST /api/books
// @desc    Create a new book
// @access  Protected (requires authentication middleware to populate req.user)
exports.createBook = async (req, res) => {
    // Create a new book with the request body data and the ID of the authenticated user
  const book = new Book({ ...req.body, createdBy: req.user });
  // Save the book to the database
  await book.save();
   // Respond with the created book and HTTP status 201 (Created)
  res.status(201).json({message: 'Book created successfully',book});
};
// @route   GET /api/books
// @desc    Get list of books with optional filters and pagination
// @access  Public
exports.getBooks = async (req, res) => {
    // Destructure query parameters for pagination and filtering
  const { page = 1, limit = 10, author, genre } = req.query;
   // Build filter object based on provided query parameters
  const filter = {};
  if (author) filter.author = new RegExp(author, 'i'); // Case-insensitive match
  if (genre)  filter.genre  = genre;
 // Fetch books from the database with filters and pagination
  const books = await Book.find(filter)
    .skip((page - 1) * limit)  // Skip documents for previous pages
    .limit(parseInt(limit));   // Limit number of documents per page
     // Respond with the list of books
  res.json(books);
};
// @route   GET /api/books/:id
// @desc    Get book details by ID, including average rating and paginated reviews
// @access  Public
exports.getBookById = async (req, res) => {
    // Find the book by its ID
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ msg: 'Book not found' });

  // average rating
  const agg = await Review.aggregate([
    { $match: { book: book._id } },                           // Match reviews for this book
    { $group: { _id: null, avgRating: { $avg: '$rating' } } } // Calculate average
  ]);
  const avgRating = agg[0]?.avgRating || 0;                   // Default to 0 if no reviews

  // reviews pagination
  const { page = 1, limit = 5 } = req.query;  
  const reviews = await Review.find({ book: book._id })
    .populate('user', 'name')                                  // Populate user's name in review
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
   // Respond with book info, average rating, and reviews
  res.json({ book, avgRating, reviews });
};
