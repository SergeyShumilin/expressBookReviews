const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = () => books;
const getBookByIsbn = (isbn) => books[isbn];
const getBooksByAuthor = (author) => Object.entries(books)
  .reduce((acc, [isbn, cur]) => {
    return cur.author === author ? ({...acc, [isbn]: cur}) : acc;
  }, {});
const getBooksByTitle = (title) => Object.entries(books)
  .reduce((acc, [isbn, cur]) => {
    return cur.title === title ? ({...acc, [isbn]: cur}) : acc;
  }, {});

public_users.post("/register", (req,res) => {
  const newUser = {
    username: req.body.username,
    password: req.body.password,
  }
  if (newUser.username && newUser.password) {
    if (isValid(newUser.username)) {
      users.push(newUser);

      return res.status(200).send('The user has been successfully registered');
    }

    return res.status(200).send('Already exists');
  }

  return res.status(200).send('Missing mandatory parameters');
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  const books = await getBooks();

  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const book = await getBookByIsbn(req.params.isbn);
  return book ? res.status(200).send(JSON.stringify(book, null, 4))
    : res.status(404).send('Not found');
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const booksByAuthor = await getBooksByAuthor(req.params.author);

  return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const booksByTitle = await getBooksByTitle(req.params.title);

  return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const reviews = books[req.params.isbn]?.reviews ?? null;
  return reviews ? res.status(200).send(JSON.stringify(reviews, null, 4))
    : res.status(404).send('Not found');
});

module.exports.general = public_users;
