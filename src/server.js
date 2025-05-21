require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse incoming JSON payloads
app.use(express.json());

app.use('/auth',   require('./routes/auth'));       // Mount authentication routes under /auth
app.use('/books',  require('./routes/books'));      // Mount book-related routes under /books
app.use('/',       require('./routes/reviews'));    // Mount review routes at the root level (can include /:id/reviews, etc.)

// @route   GET /search?q=keyword
// @desc    Search for books by title or author (case-insensitive)
// @access  Public
app.get('/search', async (req, res) => {
  const q = req.query.q || '';            // Get query string, default to empty
   // Search books where title or author matches the query string (case-insensitive)
  const books = await Book.find({
    $or: [
      { title:  { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } }
    ]
  })
  .limit(20);                              // Limit results to 20 books
  res.json(books);
});

// search
const Book = require('./models/Book');
//app.get('/search', require('./routes/search')); // see above snippet

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}  \n http://localhost:5000`));