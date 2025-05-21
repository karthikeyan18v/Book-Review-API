# Book-Review-API
A simple RESTful API for managing books and reviews, built with Node.js, Express, MongoDB, and JWT authentication.

Prerequisites
Node.js v14+
MongoDB (local or Atlas)
Postman or curl for testing

Project Setup
Clone the repository
git clone https://github.com/yourusername/book-review-api.git
cd book-review-api
npm install
 or
 
mkdir book-review-api
cd book-review-api
npm init 
npm install express mongoose dotenv bcryptjs jsonwebtoken express-validator
npm install --save-dev nodemon

Running Locally
npm run dev
(or)
npm start
The server will start on http://localhost:5000 by default.

Environment Variables

Create a .env file in the project root with the following keys:
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookreview
JWT_SECRET=<your-random-secret>
JWT_EXPIRES_IN=1h

MONGO_URI: your MongoDB connection string (Atlas or local).
JWT_SECRET: a long random string used to sign tokens.
JWT_EXPIRES_IN: token expiration (e.g., 1h, 30m, 7d).

API Endpoints
Authentication
Method
Endpoint
Description
POST
/auth/signup
Register a new user
POST
/auth/login
Authenticate and get token
Books
Method
Endpoint
Auth
Description
POST
/books
Yes

Create a new book
GET
/books
No
List books (pagination, filters)
GET
/books/:id
No
Retrieve book details + avg rating + reviews
PUT
/books/:id
Yes
Update a book
DELETE
/books/:id
Yes
Delete a book
Reviews
Method
Endpoint
Auth
Description

POST
/:bookId/reviews
Yes

Add a review (one per user/book)
PUT

/reviews/:reviewId
Yes

Update your review
DELETE

/reviews/:reviewId
Yes

Delete your review
Search

Method

Endpoint
Description

GET
/search?q=<term>

Search books by title or author (case-insensitive, partial)
Example Requests

cURL
# Signup
echo '{"name":"Bob","email":"bob@example.com","password":"pass123"}' \
  | curl -X POST http://localhost:5000/auth/signup \
    -H "Content-Type: application/json" \
    -d @-

# Login and save token
TOKEN=$(curl -s -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@example.com","password":"pass123"}' \
  | jq -r .token)

# Create Book
curl -X POST http://localhost:5000/books \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"1984","author":"Orwell","genre":"Dystopian","description":"..."}'

Postman
Create an environment with variables:base_url = http://localhost:5000, jwt_token, book_id, review_id
Signup request → store jwt_token in Tests script.
Use Bearer Auth → {{jwt_token}} for protected routes.
Create Book → store {{book_id}}.
Submit Review → store {{review_id}}.
Design Decisions & Assumptions
MongoDB for flexible schema and ease of setup.
Mongoose ODM for schema definitions and validations.
JWT for stateless authentication.
One review per user per book enforced via a compound unique index.
Basic input validation using express-validator.
No pagination on reviews in book-detail; could be added if needed.
Database Schema
User
Field
Type
Description
_id
ObjectId
Primary key
name
String
Full name
email
String
Unique, required
password
String
Hashed
Book
Field
Type
Description
_id
ObjectId
Primary key
title
String
Indexed
author
String
Indexed
genre
String
description
String
createdBy
ObjectId
Ref → User
createdAt
Date
Timestamp
updatedAt
Date
Timestamp
Review
Field
Type
Description
_id
ObjectId
Primary key
book
ObjectId
Ref → Book
user
ObjectId
Ref → User
rating
Number
1–5
comment
String
createdAt
Date
Timestamp
Compound unique index on (book, user) to enforce one review per user per book.
