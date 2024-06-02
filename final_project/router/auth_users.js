const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const JWT_SECRET = 'fingerprint_customer';

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const isExisting = users.some((user) => user.username = req.body.username && user.password === req.body.password);

  if (isExisting) {
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
