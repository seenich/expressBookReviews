const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];


const isValid = (username)=>{ //returns boolean
    // Check if any user in the 'users' array matches the provided username
    let userswithsamename = users.filter((user) => user.username === username);
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the 'users' array for a user matching both username and password
    let validusers = users.filter((user) => (user.username === username && user.password === password));
       
    if (validusers.length > 0) {
        return true; // Credentials match
    } else {
        return false; // Invalid credentials
    }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;


    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }


    if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
    data: password
    }, 'access', { expiresIn: 60 * 60 });
           req.session.authorization = {
               accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review; // Get the review content from the query parameter
   
    const username = req.session.authorization.username;
   
    // 2. Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }
   
    // 3. Ensure the reviews object exists for the book
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }


    const action = books[isbn].reviews[username] ? 'updated' : 'added';
   
    books[isbn].reviews[username] = review;


    return res.status(200).json({
        message: "Review successfully ${action} for ISBN ${isbn} by user ${username}.",
        reviews: books[isbn].reviews // Optionally return all reviews for verification
    });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;





