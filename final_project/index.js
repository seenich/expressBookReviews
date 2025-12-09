const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
// Import routes
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;


const app = express();

// 1. Enable Body Parsers for ALL routes
app.use(express.json()); // Handles application/json bodies
app.use(express.urlencoded({ extended: true })); // <-- ADDED: Handles application/x-www-form-urlencoded bodies

// 2. Configure Session Middleware (Only applied to /customer routes)
app.use("/customer", session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// 3. Authentication Guard Middleware (Only applied to /customer/auth/* routes)
app.use("/customer/auth/*", function auth(req,res,next){
    // Check if user is logged in and has valid access token
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});


// Mount the protected routes first
app.use("/customer", customer_routes);

// Mount the general/public routes last
app.use("/", genl_routes); 


// --- Server Start ---

const PORT = 5000;

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
