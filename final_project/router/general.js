const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
 
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json(books);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
 
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
 });
 
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase();
    const filteredBooks = Object.values(books).filter(
      (book) => book.author.toLowerCase() === author
    );
 
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {


    const titleToFind = req.params.title.toLowerCase();
    const bookKeys = Object.keys(books);
    let matchedBooks = [];




    for (let key of bookKeys) {
    const book = books[key];
   
    if (book.title.toLowerCase() === titleToFind) {
        matchedBooks.push(book);
        }
    }


    if (matchedBooks.length > 0) {
    // Return all matched books with a 200 status
        return res.status(200).json(matchedBooks);
    } else {
    // Return a 404 status if no books are found
    return res.status(404).json({ message: "No books found with this title" });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {


    const isbn = req.params.isbn;


    if (books[isbn]) {
    const bookReviews = books[isbn].reviews;
    return res.status(200).json(bookReviews);
    } else {
    return res.status(404).json({ message: "Book with this ISBN not found" });
    }


});


module.exports.general = public_users;





