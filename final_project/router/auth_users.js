const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const JWT_SECRET = 'fingerprint_customer';

const isValid = (username)=>{ //returns boolean
 return !users.some((user) => user.username = username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some((user) => user.username = username && user.password === password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  if (authenticatedUser(req.body.username, req.body.password)) {
    const token = jwt.sign({ user: req.body.username, password: req.body.password }, JWT_SECRET);

    req.session.authorization = {
      accessToken: token,
    };

    return res.status(200).json({message: "Logged in"});
  }

  return res.status(200).json({message: "User not found"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];

  if (book) {
    book.reviews = {
      ...book.reviews,
      [req.user]: req.query.review,
    };

    return res.status(200).json(book);
  }

  return res.status(404).json({message: "Not found"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];

  if (book) {
    delete book.reviews[req.user];

    return res.status(200).json(book);
  }

  return res.status(404).json({message: "Not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.JWT_SECRET = JWT_SECRET;
