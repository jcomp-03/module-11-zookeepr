// we'll require the following modules/packages
const apiRoutes = require('./routes/apiRoutes'); // the require statement will read the index.js file in this location
const htmlRoutes = require('./routes/htmlRoutes'); // the require statement will read the index.js file in this location
const express = require('express'); // 3rd-party module
const fs = require('fs'); // native to Node.js
const path = require('path'); // native to Node.js
// creating a route that the front-end
// can request data from. Start by requiring the data
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001;

// instantiate the server
// const app = express();

// parse incoming string or array data. We used the app.use() method. This is a method executed
// by our Express.js server that mounts a function to the server that our requests will pass through before 
// getting to the intended endpoint. The functions we can mount to our server are referred to as middleware. 
// The express.urlencoded({extended: true}) method is a method built into Express.js. It takes incoming POST
// data and converts it to key/value pairings that can be accessed in the req.body object.
// The extended: true option set inside the method call informs our server that there may be sub-array data
// nested in it as well, so it needs to look as deep into the POST data as possible to parse all of the data correctly.
// The express.json() method we used takes incoming POST data in the form of JSON and parses it into the
// req.body JavaScript object. Both of the above middleware functions need to be set up every time you create
// a server that's looking to accept POST data.
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());

// this middleware method allows us to access front-end code
// without having a specific server endpoint created for it.
app.use(express.static(path.join(__dirname, 'public')));

// any time a client navigates to <ourhost>/api, the app will use
// the router we set up in apiRoutes. If '/' is the endpoint, then
// the router will serve back our HTML routes.
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);


// make our server listen by chaining the .listen method
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});