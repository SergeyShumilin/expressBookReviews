const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const newUser = {
    username: req.body.username,
    password: req.body.password,
  }
  if (newUser.username && newUser.password) {
    const isExisting = users.some((user) => user.username = newUser.username && user.password === newUser.password);

    if (isExisting) {
      return res.status(200).send('Already exists');
    }

    users.push(newUser);

    return res.status(200).send('The user has been successfully registered');
  }

  return res.status(200).send('Missing mandatory parameters');
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  return book ? res.status(200).send(JSON.stringify(book, null, 4))
    : res.status(404).send('Not found');
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const booksByAuthor = Object.entries(books)
    .reduce((acc, [isbn, cur]) => {
      return cur.author === req.params.author ? ({...acc, [isbn]: cur}) : acc;
    }, {});

  return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const booksByTitle = Object.entries(books)
    .reduce((acc, [isbn, cur]) => {
      return cur.title === req.params.title ? ({...acc, [isbn]: cur}) : acc;
    }, {});

  return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const reviews = books[req.params.isbn]?.reviews ?? null;
  return reviews ? res.status(200).send(JSON.stringify(reviews, null, 4))
    : res.status(404).send('Not found');
});

module.exports.general = public_users;
