const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
/*public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});*/
let returnAllBooks = new Promise((resolve, reject) => {
    try {
	    resolve(JSON.stringify(books,null,4));
    } catch(err) {
        reject(err);
    }
});

public_users.get('/', (req, res) => {
    returnAllBooks.then(
        (do_this) => res.send(do_this),
        (err) => res.send("Error returning books"));
})


// Get book details based on ISBN
let getbyISBN = new Promise((resolve, reject) => {
    public_users.get('/isbn/:isbn',function (req, res) {
        const isbn = req.params.isbn;
        res.send(books[isbn]);
    });
});
  
// Get book details based on author
let getbyauthor = new Promise((resolve, reject) => {
    public_users.get('/author/:author',function (req, res) {
        const author = req.params.author;
        const book_keys = Object.keys(books);
        let filtered_books = book_keys.filter((book) => books[book].author === author);
        res.send(filtered_books.map(x => books[x]));
    });
});

// Get all books based on title
let getbytitle = new Promise((resolve, reject) => {
    public_users.get('/title/:title',function (req, res) {
        const title = req.params.title;
        const title_keys = Object.keys(books);
        let filtered_titles = title_keys.filter((book) => books[book].title === title);
        res.send(filtered_titles.map(x => books[x]));
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
